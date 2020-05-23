import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Badge from "@material-ui/core/Badge";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { handleLogout } from "../../Handlers/Handlers";
class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.classes = makeStyles((theme) => ({
      root: {
        "& > *": {
          margin: theme.spacing(1),
          width: 200,
        },
      },
    }));
  }

  render() {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <Badge color="secondary">
              <LogoutIcon {...bindTrigger(popupState)} />
            </Badge>
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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleLogout(this.props.onLogout)}
              >
                Log Out
              </Button>
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }
}
export default Logout;
