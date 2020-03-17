import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes from "../Routes/Routes";
import UserActionsDropDownTab from "../Views/UserActions/UserActionsDropDownTab";
import { loginPath, logoutPath } from "../consts/paths";

export default function TablPanel(props) {
  return (
    <Router>
      <Paper square>
        <Tabs indicatorColor="primary" aria-label="tabs">
          {!props.isLogged && (
            <Link to={loginPath}>
              <Tab label="Login" />
            </Link>
          )}
          {props.isLogged && (
            <Link to={logoutPath}>
              <Tab label="Logout" />
            </Link>
          )}
          {props.isLogged && <UserActionsDropDownTab></UserActionsDropDownTab>}
        </Tabs>
      </Paper>
      <Routes {...props}></Routes>
    </Router>
  );
}
