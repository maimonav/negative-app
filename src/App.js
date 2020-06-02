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
      disableTabs: false,
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
        this.setState({
          messageType: "ERROR",
          messageError: message,
          disableTabs: true,
        });
      }
    };

    socket.onclose = () => {
      console.log("disconnected");
      this.onLogout();
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
      return <Login handleLogin={handleLogin} onLogin={this.onLogin} />;
    }
    // if (messageType === "ERROR") {
    //   return (
    //     <ErrorPage
    //       messageError={messageError}
    //       userName={username}
    //       permission={permission}
    //     />
    //   );
    // }
    else {
      return (
        <TabPanel
          isLogged={isLogged}
          onLogin={this.onLogin}
          onLogout={this.onLogout}
          userName={username}
          permission={permission}
          messageType={messageType}
          messageContent={messageContent}
          disableTabs={disableTabs}
        ></TabPanel>
      );
    }
  }
}

export default App;
