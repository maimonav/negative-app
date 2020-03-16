import React from "react";
import TabPanel from "./Components/TabPanel";

class App extends React.Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem("username");
    console.log(user);
    this.state = {
      isLogged: user ? true : false
    };
  }

  onLogin = username => {
    this.setState({ isLogged: true });
    localStorage.setItem("username", username);
    console.log("logged in");
  };

  onLogout = () => {
    this.setState({ isLogged: false });
    localStorage.setItem("username", "");
    console.log("logged out");
  };

  render() {
    return (
      <TabPanel
        isLogged={this.state.isLogged}
        onLogin={this.onLogin}
        onLogout={this.onLogout}
      ></TabPanel>
    );
  }
}

export default App;
