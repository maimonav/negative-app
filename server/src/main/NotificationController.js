const WebSocket = require("ws");

class NotificationController {
  static serverSocket;
  static clientsMap = new Map();
  static usersMap = new Map();
  static initServerSocket(httpServer) {
    this.serverSocket = new WebSocket.Server({ httpServer });
  }

  static setConnectionHandler(serverSocket, initRes) {
    serverSocket.on("connection", async (socketClient, request) => {
      let clientUrl = request.headers.origin;
      console.log("connected to", clientUrl);
      this.clientsMap.set(clientUrl, socketClient);
      //console.log("client Set length: ", socketServer.clients.size);

      socketClient.on("close", (socketClient) => {
        console.log(clientUrl, "closed");
        //console.log("Number of clients: ", socketServer.clients.size);
      });

      let initResult = await initRes;
      if (typeof initResult === "string") {
        if (socketClient.readyState === WebSocket.OPEN) {
          socketClient.send(initResult);
        }
      }
    });
  }

  static setLoginHandler(username, url) {
    let clientSocket = this.clientsMap.get(url);
    this.usersMap.set(username, clientSocket);
  }
}

module.exports = NotificationController;
