import React from "react";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import NotificationsIcon from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import ListAltIcon from "@material-ui/icons/ListAlt";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import moment from "moment";

//TODO:: websocket impl
const socket = new WebSocket("ws://localhost:3001");

// Connection opened
socket.addEventListener("open", function(event) {
  socket.send("Hello Server!");
});

function getNotificationMessage(type, content, requiredQuantity) {
  switch (type) {
    case "LOW QUANTITY":
      return `Warning: you have low quantity in product ${content.name}, required: ${requiredQuantity}, got ${content.quantity}`;
    case "HIGH QUANTITY":
      return `Warning: you have high quantity in product ${content.name}, required: ${requiredQuantity}, got ${content.quantity}`;
    case "MOVIE EXAMINATION":
      return `The following movies: ${content}, were reviewed and approved in the system`;
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
      const date = moment(message[0].timeFired).format("LLLL");
      const content = message[0].content[0];
      const requiredQuantity = content.minQuantity
        ? content.minQuantity
        : content.maxQuantity;
      const notificationMessage = getNotificationMessage(
        message[0].subtype,
        content,
        requiredQuantity
      );
      this.setState(
        {
          notifications: [
            {
              name: notificationMessage,
              hasUserView: false,
              notificationDate: date,
            },
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
            <IconButton aria-label="show new notifications" color="inherit">
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
              <List style={{ width: 350 }}>
                <h3
                  style={{ fontSize: 20, marginLeft: "10px", color: "#6495ED" }}
                >
                  Notifications:
                </h3>
                <Divider />
                {notifications.map((notification) => (
                  <>
                    <Box
                      bgcolor={notification.hasUserView ? "white" : "#eaf7ff"}
                      p={2}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <ListAltIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.name}
                          secondary={notification.notificationDate}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Box>
                  </>
                ))}
              </List>
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }
}
