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

// Listen for messages
// socket.addEventListener("message", function(event) {
//   let msg = JSON.parse(event.data);
//   console.log("Message from server:\n", msg);
// });

/*
msg:
0:
content: Array(1)
0: {name: "milk", quantity: 10, minQuantity: 20}
length: 1
__proto__: Array(0)
subtype: "LOW QUANTITY"
timeFired: "2020-05-19T14:57:06.488Z"
type: "INFO"
__proto__: Object
*/
function getNotificationMessage(type, product, quantity, requiredQuantity) {
  switch (type) {
    case "LOW QUANTITY":
      return `Warning: you have low quantity in ${product}, required: ${requiredQuantity}, got ${quantity}`;
    case "HIGH QUANTITY":
      return `Warning: you have high quantity in ${product}, required: ${requiredQuantity}, got ${quantity}`;
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
          notifications: [...this.state.notifications, notificationMessage],
        },
        () => this.setState({ newNotifications: message[0].content.length })
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
    this.setState({ view: false, newNotifications: 0 });
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
                <Box p={2}>
                  <Typography color="primary">{notification}</Typography>
                </Box>
              ))}
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }
}
