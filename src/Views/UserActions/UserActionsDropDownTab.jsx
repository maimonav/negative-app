import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { manageEmployeesPath, manageSuppliersPath } from "../../consts/paths";

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
        <Link to={manageEmployeesPath}>
          <MenuItem value={1} onClick={handleClose}>
            Manage Employees
          </MenuItem>
        </Link>
        <Link to={manageSuppliersPath}>
          <MenuItem value={1} onClick={handleClose}>
            Manage Suppliers
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
