import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes from "../Routes/Routes";
import UserActionsDropDownTab from "../Views/UserActions/UserActionsDropDownTab";
import InventoryActionsDropDownTab from "../Views/InventoryActions/InventoryActionsDropDownTab";
import ReportsActionsDropDownTab from "../Views/ReportsActions/ReportsActionsDropDownTab";
import NotificationHandler from "./NotificationHandler";
import IconButton from "@material-ui/core/IconButton";
import { handleLogout } from "../Handlers/Handlers";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DescriptionIcon from "@material-ui/icons/Description";
import {
  userActionsTabHook,
  inventoryActionsTabHook,
  logoutTabHook,
  notificationTabHook,
  reportsActionsTabHook,
  logFileButtonHook,
} from "../consts/data-hooks";
import { logFilePath } from "../consts/paths";
import { isAdmin } from "../consts/permissions";

export default function TablPanel(props) {
  return (
    <Router>
      <Paper square>
        <Tabs style={{ backgroundColor: "#F8F8FF" }} aria-label="tabs">
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
              disabled={props.disableTabs}
            />
          )}
          {props.isLogged && (
            <InventoryActionsDropDownTab
              data-hook={inventoryActionsTabHook}
              permission={props.permission}
              disabled={props.disableTabs}
            />
          )}

          {props.isLogged && (
            <ReportsActionsDropDownTab
              data-hook={reportsActionsTabHook}
              permission={props.permission}
              disabled={props.disableTabs}
            />
          )}
          {props.isLogged && (
            <>
              <Link
                to={logFilePath}
                style={{
                  textDecoration: "none",
                  color: "black",
                  marginLeft: "auto",
                  marginRight: "30px",
                }}
              >
                {isAdmin(props.permission) && (
                  <IconButton
                    color="inherit"
                    aria-label="logFile"
                    id={logFileButtonHook}
                  >
                    <DescriptionIcon />
                  </IconButton>
                )}
              </Link>
            </>
          )}
          {props.isLogged && !props.disableTabs && (
            <div style={{ marginRight: "20px" }}>
              <NotificationHandler
                messageType={props.messageType}
                messageContent={props.messageContent}
                isUserLogged={props.isLogged}
                userName={props.userName}
                data-hook={notificationTabHook}
              />
            </div>
          )}
          {props.isLogged && !props.disableTabs && (
            <>
              <IconButton
                style={{ marginRight: "30px" }}
                onClick={() => handleLogout(props.onLogout)}
                color="inherit"
                aria-label="log out"
                data-hook={logoutTabHook}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Tabs>
      </Paper>
      <Routes {...props}></Routes>
    </Router>
  );
}
