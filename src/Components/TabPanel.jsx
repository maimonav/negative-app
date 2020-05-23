import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../Routes/Routes";
import UserActionsDropDownTab from "../Views/UserActions/UserActionsDropDownTab";
import InventoryActionsDropDownTab from "../Views/InventoryActions/InventoryActionsDropDownTab";
import ReportsActionsDropDownTab from "../Views/ReportsActions/ReportsActionsDropDownTab";
import NotificationHandler from "./NotificationHandler";
import IconButton from "@material-ui/core/IconButton";
import { handleLogout } from "../Handlers/Handlers";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import {
  userActionsTabHook,
  inventoryActionsTabHook,
  logoutTabHook,
  notificationTabHook,
  reportsActionsTabHook,
} from "../consts/data-hooks";
export default function TablPanel(props) {
  return (
    <Router>
      <Paper square>
        <Tabs indicatorColor="primary" aria-label="tabs">
          {props.isLogged && (
            <Tab
              label={`Welcome back, ${props.userName}`}
              style={{
                textTransform: "none",
                marginLeft: "15px",
              }}
            />
          )}
          {props.isLogged && (
            <UserActionsDropDownTab
              data-hook={userActionsTabHook}
              permission={props.permission}
            />
          )}
          {props.isLogged && (
            <InventoryActionsDropDownTab
              data-hook={inventoryActionsTabHook}
              permission={props.permission}
            />
          )}

          {props.isLogged && (
            <ReportsActionsDropDownTab
              data-hook={reportsActionsTabHook}
              permission={props.permission}
            />
          )}
          {props.isLogged && (
            <Tab
              style={{ marginLeft: "auto", paddingLeft: "105px" }}
              label={<NotificationHandler />}
              data-hook={notificationTabHook}
            />
          )}
          {props.isLogged && (
            <Tab
              label={
                <IconButton
                  style={{ marginRight: "100px" }}
                  onClick={() => handleLogout(props.onLogout)}
                  color="inherit"
                  aria-label="add to shopping cart"
                >
                  <LogoutIcon />
                </IconButton>
              }
              data-hook={logoutTabHook}
            />
          )}
        </Tabs>
      </Paper>
      <Routes {...props}></Routes>
    </Router>
  );
}
