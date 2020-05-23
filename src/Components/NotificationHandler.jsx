import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

//TODO:: websocket impl
const socket = new WebSocket("ws://localhost:3001");

// Connection opened
socket.addEventListener("open", function(event) {
  socket.send("Hello Server!");
});

function getNotificationMessage(type, product, quantity, requiredQuantity) {
  switch (type) {
    case "LOW QUANTITY":
      return `Warning: you have low quantity in product ${product}, required: ${requiredQuantity}, got ${quantity}`;
    case "HIGH QUANTITY":
      return `Warning: you have high quantity in product ${product}, required: ${requiredQuantity}, got ${quantity}`;
    default:
      return "";
  }
}

export default class NotificationHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      view: false,
      newNotifications: 0,
      changeColor: false,
    };
  }

  componentDidMount() {
    socket.onopen = () => {
      console.log("connected");
    };

    socket.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      const content = message[0].content[0];
      const requiredQuantity = content.minQuantity
        ? content.minQuantity
        : content.maxQuantity;
      const notificationMessage = getNotificationMessage(
        message[0].subtype,
        content.name,
        content.quantity,
        requiredQuantity
      );
      this.setState(
        {
          notifications: [
            { name: notificationMessage, hasUserView: false },
            ...this.state.notifications,
          ],
        },
        () =>
          this.setState({
            newNotifications:
              this.state.newNotifications + message[0].content.length,
          })
      );
      console.log(message);
    };

    socket.onclose = () => {
      console.log("disconnected");
    };
  }

  handleNotificationNumber() {
    const { notifications, view } = this.state;
    if (view) {
      return 0;
    }
    return notifications.length;
  }

  handleOnEnter = () => {
    this.setState({ view: true });
  };

  handleOnExited = () => {
    const { notifications } = this.state;
    for (let i in notifications) {
      let notification = notifications[i];
      notification.hasUserView = true;
    }
    this.setState({ view: false, newNotifications: 0, notifications });
  };

  render() {
    const { notifications, view, newNotifications } = this.state;
    console.log("array:", notifications);
    console.log("view:", view);
    console.log("newNotifications:", newNotifications);
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <IconButton aria-label="show 1 new notifications" color="inherit">
              <Badge
                badgeContent={view ? 0 : newNotifications}
                color="secondary"
              >
                <NotificationsIcon {...bindTrigger(popupState)} />
              </Badge>
            </IconButton>
            <Popover
              {...bindPopover(popupState)}
              onEntered={this.handleOnEnter}
              onExited={this.handleOnExited}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {notifications.map((notification) => (
                <Box
                  bgcolor={
                    notification.hasUserView ? "text.disabled" : "info.main"
                  }
                  p={2}
                >
                  <Typography>{notification.name}</Typography>
                </Box>
              ))}
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }
}
