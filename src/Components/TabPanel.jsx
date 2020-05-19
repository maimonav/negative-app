import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes from "../Routes/Routes";
import UserActionsDropDownTab from "../Views/UserActions/UserActionsDropDownTab";
import { logoutPath } from "../consts/paths";
import InventoryActionsDropDownTab from "../Views/InventoryActions/InventoryActionsDropDownTab";
import ReportsActionsDropDownTab from "../Views/ReportsActions/ReportsActionsDropDownTab";
import NotificationHandler from "./NotificationHandler";
import {
  userActionsTabHook,
  inventoryActionsTabHook,
  logoutTabHook,
  notificationTabHook,
  reportsActionsTabHook
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
                marginLeft: "15px"
              }}
            ></Tab>
          )}
          {props.isLogged && (
            <UserActionsDropDownTab
              data-hook={userActionsTabHook}
              permission={props.permission}
            ></UserActionsDropDownTab>
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
              style={{ marginLeft: "auto" }}
              label={<NotificationHandler />}
              data-hook={notificationTabHook}
            ></Tab>
          )}
          {props.isLogged && (
            <Link to={logoutPath}>
              <Tab label={<LogoutIcon />} data-hook={logoutTabHook}></Tab>
            </Link>
          )}
        </Tabs>
      </Paper>
      <Routes {...props}></Routes>
    </Router>
  );
}
