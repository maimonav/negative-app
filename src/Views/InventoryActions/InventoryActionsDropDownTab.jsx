import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  manageInventoryPath,
  manageCafeteriaPath,
  addCategoryPath,
  removeCategoryPath,
  manageMoviesPath
} from "../../consts/paths";
import { moviesTabHook } from "../../consts/data-hooks";

export default function InventoryActionsDropDownTab(props) {
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
      >
        <Link to={manageInventoryPath}>
          <MenuItem value={1} onClick={handleClose}>
            Manage Inventory
          </MenuItem>
        </Link>
        <Link to={manageCafeteriaPath}>
          <MenuItem value={1} onClick={handleClose}>
            Manage Cafeteria
          </MenuItem>
        </Link>
        <Link to={manageMoviesPath}>
          <MenuItem value={1} onClick={handleClose} data-hook={moviesTabHook}>
            Manage Movies
          </MenuItem>
        </Link>
        <Link to={addCategoryPath}>
          <MenuItem value={1} onClick={handleClose}>
            Add Category
          </MenuItem>
        </Link>
        <Link to={removeCategoryPath}>
          <MenuItem value={1} onClick={handleClose}>
            Remove Category
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
