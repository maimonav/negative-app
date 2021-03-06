import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import { createDailyReportPath, manageReportsPath } from "../../consts/paths";
import {
  createDailyReportTabHook,
  manageReportsTabHook
} from "../../consts/data-hooks";
import { isAtLeastShiftManager } from "../../consts/permissions";
const style = { textDecoration: "none", color: "black" };

export default function ReportsActionsDropDownTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    props.handleTabChange && props.handleTabChange(path);
  };

  if (!isAtLeastShiftManager(props.permission)) {
    return null;
  }

  return (
    <>
      <Button
        aria-controls="drop-down-tab"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ textTransform: "none", minWidth: "150px" }}
        {...props}
      >
        Reports Actions
      </Button>
      <Menu
        id="drop-down-tab"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          marginTop: "34px",
          marginLeft: "5px",
          maxWidth: "175px"
        }}
      >
        <Link to={manageReportsPath} style={style}>
          <MenuItem
            value={1}
            onClick={handleClose}
            style={{ justifyContent: "center" }}
            d
          >
            <Tab
              label="Manage Reports"
              style={{ textTransform: "none" }}
              data-hook={manageReportsTabHook}
            />
          </MenuItem>
        </Link>
        <Link to={createDailyReportPath} style={style}>
          <MenuItem
            value={1}
            onClick={handleClose}
            style={{ justifyContent: "center" }}
            d
          >
            <Tab
              label="Create Daily Report"
              style={{ textTransform: "none" }}
              data-hook={createDailyReportTabHook}
            />
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
