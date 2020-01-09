import React from "react";
import "./App.css";
import TabPanel from "./Components/TabPanel";
import Login from "./Components/Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tabNumber: 0 };
  }

  handleChange = tabNumber => {
    //Login
    this.setState({ tabNumber });
  };
  isLogin = () => {
    return this.state.tabNumber === 1;
  };

  handleSubmit = (username, password) => {
    if (this.isLogin())
      fetch(
        `/api/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      )
        .then(response => response.json())
        .then(state => alert(state.result));
  };
  render() {
    return (
      <div>
        <TabPanel
          tabNumber={this.state.tabNumber}
          handleChange={this.handleChange}
        />
        {this.isLogin() ? (
          <Login handleSubmit={this.handleSubmit}></Login>
        ) : (
          "To be continued..."
        )}
      </div>
    );
  }
}

export default App;
