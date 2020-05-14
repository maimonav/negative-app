const WebSocket = require("ws");

class NotificationController {
  static serverSocket;
  static ManagerUsername;
  static DeputyManagerUsername;
  static clientsMap = new Map();
  static usersMap = new Map();
  static loggedIn = new Set();
  static initServerSocket(httpServer) {
    this.serverSocket = new WebSocket.Server({ httpServer });
  }

  static setConnectionHandler(serverSocket, initRes) {
    serverSocket.on("connection", async (socketClient, request) => {
      let clientUrl = request.headers.origin;
      console.log("connected to", clientUrl);
      this.clientsMap.set(clientUrl, socketClient);
      console.log("Number of clients:", serverSocket.clients.size);

      socketClient.on("close", (socketClient) => {
        console.log(clientUrl, "closed");
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

  static loginHandler(username, url) {
    url = new URL(url);
    let clientSocket = this.clientsMap.get(url.origin);
    this.usersMap.set(username, clientSocket);
    this.loggedIn.add(username);
    //send all notifications from db?? that have not sent, and update to seen
  }

  static logoutHandler(username) {
    this.loggedIn.delete(username);
  }

  static notifyLowQuantity(productList) {
    this.notify(
      [this.ManagerUsername, this.DeputyManagerUsername],
      "LOW QUANTITY",
      productList
    );
  }

  static notifyHighQuantity(productList) {
    this.notify(
      [this.ManagerUsername, this.DeputyManagerUsername],
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
      let clientSocket = this.usersMap.get(usersList[i]);
      if (clientSocket) clientSocket.send(notification); // todo:: insert to db seen
      //else - insert to db unseen
    }

    //insert list of notification to db
  }
}

module.exports = NotificationController;
