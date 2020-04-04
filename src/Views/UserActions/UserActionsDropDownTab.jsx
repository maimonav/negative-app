import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { manageEmployeesPath, manageSuppliersPath } from "../../consts/paths";
import { employeesTabHook, suppliersTabHook } from "../../consts/data-hooks";
import Tab from "@material-ui/core/Tab";
const style = { textDecoration: "none", color: "black" };

export default function UserActionsDropDownTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    props.handleTabChange && props.handleTabChange(path);
  };

  return (
    <>
      <Button
        aria-controls="drop-down-tab"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ textTransform: "none", marginLeft: "15px" }}
        {...props}
      >
        User Actions
      </Button>
      <Menu
        id="drop-down-tab"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link to={manageEmployeesPath} style={style}>
          <MenuItem
            value={1}
            onClick={handleClose}
            data-hook={employeesTabHook}
          >
            <Tab label="Manage Employees" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
        <Link to={manageSuppliersPath} style={style}>
          <MenuItem
            value={1}
            onClick={handleClose}
            data-hook={suppliersTabHook}
          >
            <Tab label="Manage Suppliers" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
