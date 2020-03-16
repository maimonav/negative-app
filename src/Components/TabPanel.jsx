import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import DropDownTab from "./DropDownTab";
import Login from "../Views/Login";
import Logout from "../Views/Logout";
import AddEmployee from "../Views/UserActions/AddEmployee";
import EditEmployee from "../Views/UserActions/EditEmployee";
import RemoveEmployee from "../Views/UserActions/RemoveEmployee";
import {
  handleLogin,
  handleLogout,
  handleAddEmployee,
  handleEditEmployee,
  handleRemoveEmployee
} from "../Handlers/Handlers";

export default function TablPanel(props) {
  const [value, setValue] = React.useState(props.tabNumber);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handleTabChange && props.handleTabChange(newValue);
  };

  return (
    <Router>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="tabs"
        >
          {!props.isLogged && (
            <Link to={"/login"} className="nav-link">
              <Tab label="Login" />
            </Link>
          )}
          {props.isLogged && (
            <Link to={"/logout"} className="nav-link">
              <Tab label="Logout" />
            </Link>
          )}
          {props.isLogged && (
            <Link to={"/addEmployee"} className="nav-link">
              <Tab label="Add Employee" />
            </Link>
          )}
          {props.isLogged && (
            <Link to={"/editEmployee"} className="nav-link">
              <Tab label="Edit Employee" />
            </Link>
          )}
          {props.isLogged && (
            <Link to={"/removeEmployee"} className="nav-link">
              <Tab label="Remove Employee" />
            </Link>
          )}
          {/* <DropDownTab handleTabChange={handleChange}></DropDownTab> */}
        </Tabs>
      </Paper>
      <Switch>
        {!props.isLogged && (
          <Route
            path="/login"
            component={() => (
              <Login handleLogin={handleLogin} onLogin={props.onLogin} />
            )}
          />
        )}
        {props.isLogged && (
          <Route
            path="/logout"
            component={() => (
              <Logout handleLogout={handleLogout} onLogout={props.onLogout} />
            )}
          />
        )}
        {props.isLogged && (
          <Route
            path="/addEmployee"
            component={() => (
              <AddEmployee handleAddEmployee={handleAddEmployee} />
            )}
          />
        )}
        {props.isLogged && (
          <Route
            path="/editEmployee"
            component={() => (
              <EditEmployee handleEditEmployee={handleEditEmployee} />
            )}
          />
        )}
        {props.isLogged && (
          <Route
            path="/removeEmployee"
            component={() => (
              <RemoveEmployee handleRemoveEmployee={handleRemoveEmployee} />
            )}
          />
        )}
      </Switch>
    </Router>
  );
}
