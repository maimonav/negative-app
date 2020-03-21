import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  addProductPath,
  editMoviePath,
  removeMoviePath,
  editProductPath,
  removeProductPath
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
        <Link to={addProductPath}>
          <MenuItem value={1} onClick={handleClose}>
            Add New Product
          </MenuItem>
        </Link>
        <Link to={editProductPath}>
          <MenuItem value={1} onClick={handleClose}>
            Edit Product
          </MenuItem>
        </Link>
        <Link to={removeProductPath}>
          <MenuItem value={1} onClick={handleClose}>
            Remove Product
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
