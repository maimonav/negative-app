import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BaseButton from "../Components/Button";
import { actionButtonHook } from "../consts/data-hooks";
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
          data-hook={actionButtonHook}
        />
      </form>
    );
  }
}
export default Logout;
