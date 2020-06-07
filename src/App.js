import React from "react";
import TabPanel from "./Components/TabPanel";
import { Login } from "./Views";
import { errorPagePath } from "./consts/paths";
import { handleLogin, handleIsLoggedIn, ws } from "./Handlers/Handlers";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageType: "",
      messageContent: "",
      messageError: "",
      disableTabs: false,
      errorPage: false,
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

  componentDidMount = () => {
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      console.log("message:", message);
      let messagesArray = [];
      for (let i in message) {
        let not = message[i];
        if (not.type === "INFO") {
          messagesArray.push(not);
        } else if (not.type === "ERROR") {
          this.setState({
            messageType: "ERROR",
            messageError: message,
            disableTabs: true,
          });
        }
      }
      this.setState({ messageContent: messagesArray });
    };

    ws.onclose = () => {
      console.log("disconnected");
      this.onLogout();
    };
  };

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

    const { messageType, errorPage } = this.state;
    if (messageType === "ERROR" && !errorPage && username === "admin") {
      window.location.href = errorPagePath;
      this.setState({ errorPage: true });
    }
  };

  onLoginError = () => {
    const { messageType, errorPage } = this.state;
    if (messageType === "ERROR" && !errorPage) {
      window.location.href = errorPagePath;
      this.setState({ errorPage: true });
    }
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
    const {
      messageType,
      isLogged,
      username,
      permission,
      messageContent,
      messageError,
      disableTabs,
    } = this.state;
    if (!this.state.isLogged) {
      return (
        <Login
          handleLogin={handleLogin}
          onLogin={this.onLogin}
          onLoginError={this.onLoginError}
        />
      );
    } else {
      return (
        <TabPanel
          isLogged={isLogged}
          onLogin={this.onLogin}
          onLogout={this.onLogout}
          userName={username}
          permission={permission}
          messageType={messageType}
          messageContent={messageContent}
          messageError={messageError}
          disableTabs={disableTabs}
          onLoginError={this.onLoginError}
        ></TabPanel>
      );
    }
  }
}

export default App;
