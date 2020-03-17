import React from "react";
import TabPanel from "./Components/TabPanel";
import { Login } from "./Views";
import { handleLogin } from "./Handlers/Handlers";

class App extends React.Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem("username");
    this.state = {
      isLogged: user ? true : false
    };
  }

  onLogin = username => {
    this.setState({ isLogged: true });
    localStorage.setItem("username", username);
  };

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
        ></TabPanel>
      );
    }
  }
}

export default App;
