import React from "react";
import TabPanel from "./Components/TabPanel";
import Login from "./Views/Login";
import Logout from "./Views/Logout";
import Register from "./Views/Register";
import AddEmployee from "./Views/UserActions/AddEmployee";
import EditEmployee from "./Views/UserActions/EditEmployee";
import RemoveEmployee from "./Views/UserActions/RemoveEmployee";

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
    const user = localStorage.getItem("username");
    fetch(
      `api/addNewEmployee?userName=${encodeURIComponent(
        userName
      )}&password=${encodeURIComponent(
        password
      )}&firstName=${encodeURIComponent(firstName)}
      &lastName=${encodeURIComponent(lastName)}&permission=${encodeURIComponent(
        permission
      )}&contactDetails=${encodeURIComponent(
        contactDetails
      )}&user=${encodeURIComponent(user)}`
    )
      .then(response => response.json())
      .then(state => {
        alert(state.result);
      });
  };

  handleEditEmployee = (
    userName,
    password,
    firstName,
    lastName,
    permission,
    contactDetails
  ) => {
    const user = localStorage.getItem("username");
    fetch(
      `api/editEmployee?userName=${encodeURIComponent(
        userName
      )}&password=${encodeURIComponent(
        password
      )}&firstName=${encodeURIComponent(firstName)}
      &lastName=${encodeURIComponent(lastName)}&permission=${encodeURIComponent(
        permission
      )}&contactDetails=${encodeURIComponent(
        contactDetails
      )}&user=${encodeURIComponent(user)}`
    )
      .then(response => response.json())
      .then(state => {
        alert(state.result);
      });
  };

  handleRemoveEmployee = userName => {
    const user = localStorage.getItem("username");
    fetch(
      `api/removeEmployee?userName=${encodeURIComponent(
        userName
      )}&user=${encodeURIComponent(user)}`
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
        return <Login handleLogin={this.handleLogin}> </Login>;
      } else if (tabNumber === 2) {
        return <Register handleRegister={this.handleRegister}> </Register>;
      }
    } else {
      if (tabNumber === 1) {
        return <Logout handleLogout={this.handleLogout}> </Logout>;
      } else if (tabNumber === 2) {
        return <AddEmployee handleAddEmployee={this.handleAddEmployee} />;
      } else if (tabNumber === 3) {
        return <EditEmployee handleEditEmployee={this.handleEditEmployee} />;
      } else if (tabNumber === 4) {
        return (
          <RemoveEmployee handleRemoveEmployee={this.handleRemoveEmployee} />
        );
      }
    }
  };

  render() {
    return (
      <div>
        <TabPanel
          isUserLogged={this.state.isUserLogged}
          tabNumber={this.state.tabNumber}
          handleTabChange={this.handleTabChange}
        />{" "}
        {this.showWindow()}{" "}
      </div>
    );
  }
}

export default App;
