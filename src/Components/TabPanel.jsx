import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes from "../Routes/Routes";
import UserActionsDropDownTab from "../Views/UserActions/UserActionsDropDownTab";
import { loginPath, logoutPath } from "../consts/paths";
import InventoryActionsDropDownTab from "../Views/InventoryActions/InventoryActionsDropDownTab";
import ReportsActionsDropDownTab from "../Views/ReportsActions/ReportsActionsDropDownTab";
import {
  userActionsTabHook,
  inventoryActionsTabHook,
  logoutTabHook
} from "../consts/data-hooks";
export default function TablPanel(props) {
  console.log(localStorage.getItem("username"));
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
            <Tab
              label={`Welcome back, ${props.userName}`}
              style={{
                textTransform: "none",
                marginLeft: "15px"
              }}
            ></Tab>
          )}
          {props.isLogged && (
            <UserActionsDropDownTab
              data-hook={userActionsTabHook}
            ></UserActionsDropDownTab>
          )}
          {props.isLogged && (
            <InventoryActionsDropDownTab data-hook={inventoryActionsTabHook} />
          )}

          {props.isLogged && <ReportsActionsDropDownTab />}
          {props.isLogged && (
            <Link to={logoutPath} style={{ marginLeft: "auto" }}>
              <Tab
                label="Logout"
                data-hook={logoutTabHook}
                style={{ textTransform: "none" }}
              />
            </Link>
          )}
        </Tabs>
      </Paper>
      <Routes {...props}></Routes>
    </Router>
  );
}
