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
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import moment from "moment";
import { handleGetSeenNotifications } from "../Handlers/Handlers";
import { socket } from "../App";

function getNotificationMessage(type, content, requiredQuantity) {
  switch (type) {
    case "LOW QUANTITY":
      return `Warning: you have low quantity in product ${content.name}, required: ${requiredQuantity}, got ${content.quantity}`;
    case "HIGH QUANTITY":
      return `Warning: you have high quantity in product ${content.name}, required: ${requiredQuantity}, got ${content.quantity}`;
    case "MOVIE EXAMINATION":
      return `The following movies: ${content}, were reviewed and approved in the system`;
    case "EXTERNAL SYSTEM":
      return content;
    case "SAVE NOTIFICATIONS":
      return content;
    case "GET NOTIFICATIONS":
      return content;
    default:
      return "";
  }
}

const confirmMessagesArray = [
  "EXTERNAL SYSTEM",
  "SAVE NOTIFICATIONS",
  "GET NOTIFICATIONS",
];

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
    const { userName } = this.props;
    if (userName) {
      handleGetSeenNotifications(userName)
        .then((response) => response.json())
        .then((state) => {
          this.setState({ messages: state.result }, () =>
            this.createNotificationArray()
          );
        });
    }
  }

  createNotificationArray() {
    const { messages } = this.state;
    const messagesArray = [];
    for (let i in messages) {
      let message = messages[i];
      if (message.type === "INFO") {
        const notification = this.buildNotificationMessage(message, true);
        messagesArray.unshift(notification);
      }
    }
    this.setState({
      notifications: messagesArray,
    });
  }

  buildNotificationMessage(message, isOld) {
    const messageType = message.subtype;
    let content;
    let requiredQuantity;
    let confirmButton;
    if (messageType === "AUTO LOGGED OUT") {
      window.location.reload();
    }
    if (confirmMessagesArray.includes(messageType)) {
      content = message.content;
      confirmButton = true;
      this.setState({
        confirmMessage: true,
      });
    } else {
      content = message.content[0];
      requiredQuantity = content.minQuantity
        ? content.minQuantity
        : content.maxQuantity;
      confirmButton = false;
    }
    const date = moment(message.timeFired).format("LLLL");
    const notificationMessage = getNotificationMessage(
      messageType,
      content,
      requiredQuantity
    );
    const notification = {
      name: notificationMessage,
      type: messageType,
      hasUserView: isOld,
      notificationDate: date,
      confirmMessage: confirmButton,
    };
    return notification;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messageContent !== this.props.messageContent) {
      this.updateNotifications();
    }
  }

  updateNotifications() {
    const { messageContent } = this.props;
    let newNumber;
    const notification = this.buildNotificationMessage(
      messageContent[0],
      false
    );
    if (confirmMessagesArray.includes(messageContent[0].subtype)) {
      newNumber = 1;
    } else {
      newNumber = messageContent[0].content.length;
    }
    this.setState(
      {
        notifications: [notification, ...this.state.notifications],
      },
      () =>
        this.setState({
          newNotifications: this.state.newNotifications + newNumber,
        })
    );
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

  handleConfirm = (notificayionTimeFired) => {
    const time = moment(notificayionTimeFired).format();
    socket.send(
      JSON.stringify([
        {
          type: "INFO",
          subtype: "CONFIRM",
          timeFired: time,
        },
      ])
    );

    const updatedNotifications = this.state.notifications.map((not) =>
      not.notificationDate === notificayionTimeFired
        ? { ...not, confirmMessage: false }
        : not
    );
    this.setState({ notifications: updatedNotifications });
  };

  render() {
    const { notifications, view, newNotifications } = this.state;
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <>
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
              <List style={{ width: 400 }}>
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
                        {notification.confirmMessage && (
                          <>
                            <IconButton
                              onClick={() =>
                                this.handleConfirm(
                                  notification.notificationDate
                                )
                              }
                              color="inherit"
                              aria-label="add to shopping cart"
                            >
                              <Avatar>
                                <CheckBoxIcon />
                              </Avatar>
                            </IconButton>
                          </>
                        )}
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Box>
                  </>
                ))}
              </List>
            </Popover>
          </>
        )}
      </PopupState>
    );
  }
}
