import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SubmitButton from "./Button";

class Login extends React.Component {
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

  setUsername(event) {
    this.setState({ username: event.target.value });
  }
  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <form className={this.classes.root} noValidate autoComplete="off">
        <TextField
          label="Username"
          onChange={event => this.setUsername(event)}
        />
        <TextField
          label="Password"
          onChange={event => this.setPassword(event)}
        />
        <SubmitButton
          onClick={() =>
            this.props.handleSubmit(this.state.username, this.state.password)
          }
        />
      </form>
    );
  }
}
export default Login;
