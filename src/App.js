import React from "react";
import TabPanel from "./Components/TabPanel";
import { Login, ErrorPage } from "./Views";
import { handleLogin, handleIsLoggedIn } from "./Handlers/Handlers";

export const socket = new WebSocket("ws://localhost:3001");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageType: "",
      messageContent: "",
      messageError: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    const user = localStorage.getItem("username");
    const permission = localStorage.getItem("permission");
    if (user) {
      handleIsLoggedIn(user)
        .then((response) => response.json())
        .then((state) => {
          const isLogged = Boolean(state.result);
          const username = isLogged ? user : "";
          this.setState({ isLogged, username, permission });
        });
    }
  };

  componentDidMount() {
    socket.onopen = () => {
      console.log("connected");
    };

    socket.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      console.log("message:", message);
      if (message[0].type === "INFO") {
        this.setState({ messageType: "INFO", messageContent: message });
      } else if (message[0].type === "ERROR") {
        this.setState({ messageType: "ERROR", messageError: message });
      }
      console.log(message);
    };

    socket.onclose = () => {
      console.log("disconnected");
    };
  }

  /**
   * Login to system
   * onLogin
   * @param {string} username username for login to system
   * @param {string} permission username permission's
   * @returns {void}
   **/
  onLogin = (username, permission) => {
    this.setState({ isLogged: true, username, permission });
    localStorage.setItem("username", username);
    localStorage.setItem("permission", permission);
  };

  /**
   * Loginout off system
   * onLogout
   * @returns {void}
   **/
  onLogout = () => {
    this.setState({
      isLogged: false,
      username: undefined,
      permission: undefined,
    });
    localStorage.setItem("username", "");
    localStorage.setItem("permission", "");
  };

  render() {
    const { messageType } = this.state;
    if (messageType === "ERROR") {
      return <ErrorPage />;
    }
    if (!this.state.isLogged) {
      return <Login handleLogin={handleLogin} onLogin={this.onLogin} />;
    } else {
      return (
        <TabPanel
          isLogged={this.state.isLogged}
          onLogin={this.onLogin}
          onLogout={this.onLogout}
          userName={this.state.username}
          permission={this.state.permission}
          messageType={this.state.messageType}
          messageContent={this.state.messageContent}
        ></TabPanel>
      );
    }
  }
}

export default App;
