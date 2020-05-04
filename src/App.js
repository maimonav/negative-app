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
    if (user) {
      handleIsLoggedIn(user)
        .then(response => response.json())
        .then(state => {
          const isLogged = Boolean(state.result);
          const username = isLogged ? user : "";
          this.setState({ isLogged, username });
          localStorage.setItem("username", username);
        });
    }
  };

  /**
   * Login to system
   * onLogin
   * @param {string} username username for login to system
   * @returns {void}
   **/
  onLogin = username => {
    this.setState({ isLogged: true, username });
    localStorage.setItem("username", username);
  };

  /**
   * Loginout off system
   * onLogout
   * @returns {void}
   **/
  onLogout = () => {
    this.setState({ isLogged: false });
    localStorage.setItem("username", "");
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
        ></TabPanel>
      );
    }
  }
}

export default App;
