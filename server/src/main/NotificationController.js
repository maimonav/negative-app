const WebSocket = require("ws");

class NotificationController {
  static serverSocket;
  static ManagerId;
  static DeputyManagerId;
  static clientsMap = new Map();
  static usersIdToUrl = new Map();
  static loggedInUsers = new Set();
  static connectedUsers = new Set();
  static initServerSocket(httpServer) {
    this.serverSocket = new WebSocket.Server({ httpServer });
  }

  static setConnectionHandler(serverSocket, initRes) {
    serverSocket.on("connection", async (socketClient, request) => {
      let clientUrl = request.headers.origin;
      console.log("connected to", clientUrl);
      this.clientsMap.set(clientUrl, socketClient);
      this.connectedUsers.add(clientUrl);
      console.log("Number of clients:", serverSocket.clients.size);

      socketClient.on("close", (socketClient) => {
        console.log(clientUrl, "closed");
        this.connectedUsers.delete(clientUrl);
        console.log("Number of clients:", serverSocket.clients.size);
      });

      let initResult = await initRes;
      if (typeof initResult === "string") {
        let err = JSON.stringify({
          type: "ERROR",
          subtype: "INIT",
          content: initResult,
        });
        socketClient.send(err);
      }
    });
  }

  static loginHandler(userId, url) {
    url = new URL(url);
    let clientSocket = this.clientsMap.get(url.origin);
    this.usersIdToUrl.set(userId, url.origin);
    this.loggedInUsers.add(userId);
    //send all notifications from db?? that have not sent, and update to seen
  }

  static logoutHandler(userId) {
    this.loggedInUsers.delete(userId);
  }

  static notifyLowQuantity(productList) {
    this.notify(
      [this.ManagerId, this.DeputyManagerId],
      "LOW QUANTITY",
      productList
    );
  }

  static notifyHighQuantity(productList) {
    this.notify(
      [this.ManagerId, this.DeputyManagerId],
      "HIGH QUANTITY",
      productList
    );
  }

  static notify(usersList, subtype, content) {
    let notification = JSON.stringify({
      type: "NOTIFICATION",
      subtype: subtype,
      content: content,
    });
    for (let i in usersList) {
      let userId = usersList[i];
      let userUrl = this.usersIdToUrl.get(userId);
      if (
        this.loggedInUsers.has(userId) &&
        userUrl &&
        this.connectedUsers.has(userUrl)
      ) {
        let clientSocket = this.clientsMap.get(userUrl);
        clientSocket.send(notification); // todo:: insert to db seen - maybe wait to respone to seen??
      }
      //else - insert to db unseen
    }

    //insert list of notification to db
  }
}

module.exports = NotificationController;
