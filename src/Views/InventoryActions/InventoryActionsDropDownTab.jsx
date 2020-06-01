import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import {
  manageInventoryPath,
  manageCategoriesPath,
  manageMoviesPath,
  manageOrdersPath,
} from "../../consts/paths";
import {
  inventoryTabHook,
  ordersTabHook,
  moviesTabHook,
  categoriesTabHook,
} from "../../consts/data-hooks";
import {
  isAtLeastShiftManager,
  isAtLeastDeputyManager,
} from "../../consts/permissions";
const style = { textDecoration: "none", color: "black" };
const menuStyle = { justifyContent: "center" };

export default function InventoryActionsDropDownTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    setAnchorEl(null);
    props.handleTabChange && props.handleTabChange(path);
  };

  if (!isAtLeastShiftManager(props.permission)) {
    return null;
  }

  return (
    <React.Fragment>
      <Button
        aria-controls="drop-down-tab"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ textTransform: "none", minWidth: "150px" }}
        {...props}
      >
        Inventory Actions
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
          maxWidth: "175px",
        }}
      >
        {isAtLeastShiftManager(props.permission) && (
          <>
            <Link to={manageInventoryPath} style={style}>
              <MenuItem value={1} onClick={handleClose} style={menuStyle}>
                <Tab
                  label="Manage Inventory"
                  style={{ textTransform: "none" }}
                  data-hook={inventoryTabHook}
                />
              </MenuItem>
            </Link>
            <Link to={manageOrdersPath} style={style}>
              <MenuItem value={1} onClick={handleClose} style={menuStyle}>
                <Tab
                  label="Manage Orders"
                  style={{ textTransform: "none" }}
                  data-hook={ordersTabHook}
                />
              </MenuItem>
            </Link>
          </>
        )}
        {isAtLeastDeputyManager(props.permission) && (
          <>
            <Link to={manageMoviesPath} style={style}>
              <MenuItem
                value={1}
                onClick={handleClose}
                data-hook={moviesTabHook}
                style={menuStyle}
              >
                <Tab label="Manage Movies" style={{ textTransform: "none" }} />
              </MenuItem>
            </Link>
            <Link to={manageCategoriesPath} style={style}>
              <MenuItem value={1} onClick={handleClose} style={menuStyle}>
                <Tab
                  label="Manage Categories"
                  style={{ textTransform: "none" }}
                  data-hook={categoriesTabHook}
                />
              </MenuItem>
            </Link>
          </>
        )}
      </Menu>
    </React.Fragment>
  );
}
