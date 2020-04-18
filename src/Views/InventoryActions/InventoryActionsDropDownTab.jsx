import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tab from "@material-ui/core/Tab";
import {
  manageInventoryPath,
  manageCafeteriaPath,
  addCategoryPath,
  editCategoryPath,
  removeCategoryPath,
  manageMoviesPath,
} from "../../consts/paths";
import { moviesTabHook } from "../../consts/data-hooks";
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

  return (
    <>
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
        <Link to={manageInventoryPath} style={style}>
          <MenuItem value={1} onClick={handleClose} style={menuStyle}>
            <Tab label="Manage Inventory" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
        <Link to={manageCafeteriaPath} style={style}>
          <MenuItem value={1} onClick={handleClose} style={menuStyle}>
            <Tab label="Manage Cafeteria" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
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
        <Link to={addCategoryPath} style={style}>
          <MenuItem value={1} onClick={handleClose} style={menuStyle}>
            <Tab label="Add Category" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
        <Link to={editCategoryPath} style={style}>
          <MenuItem value={1} onClick={handleClose} style={menuStyle}>
            <Tab label="Edit Category" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
        <Link to={removeCategoryPath} style={style}>
          <MenuItem value={1} onClick={handleClose} style={menuStyle}>
            <Tab label="Remove Category" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
