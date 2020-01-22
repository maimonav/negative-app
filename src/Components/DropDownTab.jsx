import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function DropDownTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    props.handleTabChange && props.handleTabChange(null);
  };

  return (
    <div>
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
        <MenuItem value={1} onClick={handleClose}>
          Add New Employee
        </MenuItem>
        <MenuItem value={2} onClick={handleClose}>
          Edit Employee
        </MenuItem>
        <MenuItem value={3} onClick={handleClose}>
          Remove Employee
        </MenuItem>
      </Menu>
    </div>
  );
}
