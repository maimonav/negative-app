import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import NotificationsIcon from "@material-ui/icons/Notifications";

export default class NotificationHandler extends React.Component {
  render() {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <NotificationsIcon color="primary" {...bindTrigger(popupState)} />
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box p={2}>
                <Typography>The content of the Popover.</Typography>
              </Box>
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }
}
