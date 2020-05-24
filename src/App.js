import React from "react";
import TabPanel from "./Components/TabPanel";
import { Login } from "./Views";
import { handleLogin, handleIsLoggedIn } from "./Handlers/Handlers";
import { errorPagePath } from "./consts/paths";
import { Link } from "react-router-dom";
/*
0:
content: [{…}]
subtype: "LOW QUANTITY"
timeFired: "2020-05-24T10:27:30.023Z"
type: "INFO"
 */
export const socket = new WebSocket("ws://localhost:3001");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageType: "",
      messageContent: "",
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
      if (message[0].type === "INFO") {
        this.setState({ messageType: "INFO", messageContent: message });
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
    // if (isError()) {
    //   return <Link to={errorPagePath}></Link>;
    // }
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
