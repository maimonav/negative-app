import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BaseButton from "../Components/Button";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.classes = makeStyles(theme => ({
      root: {
        "& > *": {
          margin: theme.spacing(1),
          width: 200
        }
      }
    }));
  }

  render() {
    return (
      <form className={this.classes.root} noValidate autoComplete="off">
        <BaseButton
          name="Logout"
          onClick={() => this.props.handleLogout(this.props.onLogout)}
          data-hook="logoutButton"
        />
      </form>
    );
  }
}
export default Logout;
