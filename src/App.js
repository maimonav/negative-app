import React from "react";
import TabPanel from "./Components/TabPanel";
import { Login } from "./Views";
import { handleLogin, handleIsLoggedIn } from "./Handlers/Handlers";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setInitialState();
  }

  setInitialState = () => {
    const user = localStorage.getItem("username");
    const permission = localStorage.getItem("permission");
    if (user) {
      handleIsLoggedIn(user)
        .then(response => response.json())
        .then(state => {
          const isLogged = Boolean(state.result);
          const username = isLogged ? user : "";
          this.setState({ isLogged, username, permission });
        });
    }
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
      permission: undefined
    });
    localStorage.setItem("username", "");
    localStorage.setItem("permission", "");
  };

  render() {
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
        ></TabPanel>
      );
    }
  }
}

export default App;
