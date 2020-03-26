import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  editMoviePath,
  removeMoviePath,
  manageInventoryPath,
  manageCafeteriaPath,
  addCategoryPath,
  removeCategoryPath
} from "../../consts/paths";

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
        <Link to={editMoviePath}>
          <MenuItem value={1} onClick={handleClose}>
            Edit Movie
          </MenuItem>
        </Link>
        <Link to={removeMoviePath}>
          <MenuItem value={1} onClick={handleClose}>
            Remove Movie
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
