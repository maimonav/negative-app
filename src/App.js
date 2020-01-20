import React from "react";
import TabPanel from "./Components/TabPanel";
import Login from "./Views/Login";
import Logout from "./Views/Logout";
import Register from "./Views/Register";
import AddEmployee from "./Views/UserActions/AddEmployee";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tabNumber: 0, isUserLogged: false };
  }

  handleTabChange = tabNumber => {
    this.setState({ tabNumber });
  };

  handleLogin = (username, password) => {
    fetch(
      `/api/login?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    )
      .then(response => response.json())
      .then(state => {
        if (state.result === "User Logged in succesfully.") {
          localStorage.setItem("username", username);
          this.setState({ isUserLogged: true });
        }
        alert(state.result);
      });
  };

  handleRegister = (username, password) => {
    fetch(
      `/api/register?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    )
      .then(response => response.json())
      .then(state => {
        alert(state.result);
      });
  };

  handleLogout = () => {
    const username = localStorage.getItem("username");
    fetch(`/api/logout?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(state => {
        if (state.result === "Logout succeded.") {
          localStorage.setItem("username", "");
          this.setState({ isUserLogged: false });
        }
        alert(state.result);
      });
  };

  handleAddEmployee = (
    userName,
    password,
    firstName,
    lastName,
    permission,
    contactDetails
  ) => {
    fetch(
      `api/addNewEmployee?userName=${encodeURIComponent(
        userName
      )}&password=${encodeURIComponent(
        password
      )}&firstName=${encodeURIComponent(firstName)}
      &lastName=${encodeURIComponent(lastName)}&permission=${encodeURIComponent(
        permission
      )}&contactDetails=${encodeURIComponent(contactDetails)}`
    )
      .then(response => response.json())
      .then(state => {
        alert(state.result);
      });
  };

  returnToHome = () => {
    this.setState({ tabNumber: 0 });
  };

  showWindow = () => {
    const { tabNumber, isUserLogged } = this.state;
    if (tabNumber === 0) {
      return "Under construction...";
    } else if (!isUserLogged) {
      if (tabNumber === 1) {
        return <Login handleLogin={this.handleLogin}></Login>;
      } else if (tabNumber === 2) {
        return <Register handleRegister={this.handleRegister}></Register>;
      } else if (tabNumber === 3) {
        return <AddEmployee handleAddEmployee={this.handleAddEmployee} />;
      }
    } else {
      return <Logout handleLogout={this.handleLogout}></Logout>;
    }
  };

  render() {
    return (
      <div>
        <TabPanel
          isUserLogged={this.state.isUserLogged}
          tabNumber={this.state.tabNumber}
          handleTabChange={this.handleTabChange}
        />
        {this.showWindow()}
      </div>
    );
  }
}

export default App;
