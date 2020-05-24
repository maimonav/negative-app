const WebSocket = require("ws");
const DataBase = require("./DataLayer/DBManager");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");

class NotificationController {
  static serverSocket;
  static ManagerId;
  static DeputyManagerId;
  static clientsMap = new Map();
  static usersIdToUrl = new Map();
  static urlToUserId = new Map();
  static loggedInUsers = new Set();
  static initServerSocket(httpServer) {
    this.serverSocket = new WebSocket.Server({ httpServer });
  }

  /**
   * define event listener - on connection to server
   * @param {WebSocket} serverSocket the server websocket
   * @param {Promise(void|string)} initRes result of the server initialization, void in success, string on failure.
   */
  static setConnectionHandler(serverSocket, initRes) {
    serverSocket.on("connection", async (socketClient, request) => {
      let clientUrl = request.headers.origin;
      console.log("connected to", clientUrl);
      this.clientsMap.set(clientUrl, socketClient);
      console.log("Number of clients:", serverSocket.clients.size);
      let userId = this.urlToUserId.get(clientUrl);
      if (userId && this.loggedInUsers.has(userId))
        this._sendAllNotificationsToUserFromDB(userId, socketClient);

      socketClient.on("close", (socketClient) => {
        console.log(clientUrl, "closed");
        this.clientsMap.delete(clientUrl);
        console.log("Number of clients:", serverSocket.clients.size);
      });

      let initResult = await initRes;
      if (typeof initResult === "string") {
        let err = {
          type: "ERROR",
          subtype: "INIT",
          content: initResult,
        };
        socketClient.send(JSON.stringify([err]));
      }
    });
  }

  /**
   * mapping clients urls to usernames, sending new notifications the client had not seen yet
   * @param {string} userId username of the logged in user
   * @param {string} url url of the client
   */
  static async loginHandler(userId, url) {
    url = new URL(url);
    let clientSocket = this.clientsMap.get(url.origin);
    if (!clientSocket) {
      logger.writeToLog(
        "info",
        "NotificationController",
        "loginHandler",
        "Web socket connection to user " +
          userId +
          ", URL: " +
          url.origin +
          " failed"
      );
      return;
    }
    this.urlToUserId.set(url.origin, userId);
    this.usersIdToUrl.set(userId, url.origin);
    this.loggedInUsers.add(userId);

    this._sendAllNotificationsToUserFromDB(userId, clientSocket);
  }

  static async _sendAllNotificationsToUserFromDB(userId, clientSocket) {
    //get all notification from db and send it to the logged in user
    let notifications = await DataBase.singleFindAll(
      "notification",
      { recipientUserId: userId, seen: false },
      undefined,
      [["recipientUserId", "ASC"]]
    );

    if (typeof notifications === "string") {
      DBlogger.writeToLog(
        "info",
        "NotificationController",
        "loginHandler- singleFindAll ",
        "userId: " + userId
      );
      clientSocket.send([
        {
          type: "ERROR",
          subtype: "GET NOTIFICATIONS",
          content:
            "There was a problem sending your notifications.\n" +
            notifications +
            "\nYou can try to loggout and loggin to see them all.",
        },
      ]);
      return;
    }

    let notificationList = [];

    for (let i in notifications) {
      let notification = notifications[i];
      notification = {
        type: notification.content.type,
        subtype: notification.content.subtype,
        content: notification.content.content,
        timeFired: notification.timeFired,
      };
      notificationList = notificationList.concat(notification);
    }
    if (notificationList.length > 0) {
      clientSocket.send(JSON.stringify(notificationList));
      let result = await DataBase.singleUpdate(
        "notification",
        { recipientUserId: userId },
        { seen: true }
      );
      if (typeof result === "string") {
        DBlogger.writeToLog(
          "info",
          "NotificationController",
          "loginHandler- singleUpdate ",
          "error - seen update - userId: " + userId
        );
      }
    }
  }

  /**
   * delete client url and username from maps
   * @param {string} userId username of the logged out client
   */
  static logoutHandler(userId) {
    this.loggedInUsers.delete(userId);
    let url = this.urlToUserId.get(userId);
    this.urlToUserId.delete(url);
    this.usersIdToUrl.delete(userId);
  }

  /**
   * send notification for all products with low quantity
   * @param {Array(Object)} productList @example {name:"product", quantity:20 , minQuantity:40}
   */
  static notifyLowQuantity(productList) {
    this._notify(
      [this.ManagerId, this.DeputyManagerId],
      "LOW QUANTITY",
      productList
    );
  }

  /**
   * send notification for all products with high quantity
   * @param {Array(Object)} productList @example {name:"product", quantity:20 , maxQuantity:10}
   */
  static notifyHighQuantity(productList) {
    this._notify(
      [this.ManagerId, this.DeputyManagerId],
      "HIGH QUANTITY",
      productList
    );
  }

  /**
   * alert about all movie orders confirem and movies examined
   * @param {Array(string)} movieList movie that examined, @example ["Spiderman","Saw"]
   */
  static notifyMovieExamination(movieList) {
    this._notify(
      [this.ManagerId, this.DeputyManagerId],
      "MOVIE EXAMINATION",
      movieList
    );
  }

  static async getSeenNotifications(userId) {
    let result = await DataBase.singleFindAll("notification", {
      recipientUserId: userId,
      seen: true,
    });
    result = result.map((notification) => {
      notification.content.timeFired = notification.timeFired;
      return notification.content;
    });
    return result;
  }

  static async _notify(usersList, subtype, content) {
    let timeFired = new Date();
    let notificationContent = {
      type: "INFO",
      subtype: subtype,
      content: content,
      timeFired: timeFired,
    };
    let notificationObjectsList = [];
    for (let i in usersList) {
      let userId = usersList[i];
      if (!userId) continue;
      let userUrl = this.usersIdToUrl.get(userId);
      let seenFlag = false;
      if (
        this.loggedInUsers.has(userId) &&
        userUrl &&
        this.clientsMap.has(userUrl)
      ) {
        let clientSocket = this.clientsMap.get(userUrl);
        clientSocket.send(JSON.stringify([notificationContent]));
        //set notification as seen
        seenFlag = true;
      }
      delete notificationContent.timeFired;

      let notificationObject = {
        name: DataBase._add,
        model: "notification",
        params: {
          element: {
            recipientUserId: userId,
            timeFired: timeFired,
            seen: seenFlag,
            content: notificationContent,
          },
        },
      };
      notificationObjectsList = notificationObjectsList.concat(
        notificationObject
      );
    }

    //insert list of notification to db
    let result = await DataBase.executeActions(notificationObjectsList);

    if (typeof result === "string") {
      for (let i in usersList) {
        let userId = usersList[i];
        if (!userId) continue;
        let userUrl = this.usersIdToUrl.get(userId);
        if (
          this.loggedInUsers.has(userId) &&
          userUrl &&
          this.clientsMap.has(userUrl)
        ) {
          let clientSocket = this.clientsMap.get(userUrl);
          clientSocket.send([
            {
              type: "ERROR",
              subtype: "SAVE NOTIFICATIONS",
              content:
                "There was a problem saving your notifications," +
                "information got lost.\n",
              result,
            },
          ]);
        }
      }

      DBlogger.info(
        "NotificationController - notify - problem to insert notification to database, notifications got lost\n. Notifications List:\n",
        notificationObjectsList,
        "\n",
        result
      );
    }
  }
}

module.exports = NotificationController;
