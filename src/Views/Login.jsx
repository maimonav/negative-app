import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import BaseButton from "../Components/Button";
import { Box } from "@material-ui/core";
import { userNameHook, passwordHook, loginHook } from "../consts/data-hooks";
import "./Login.scss";

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
      <>
        <Box className="login-box">
          Login
          <form className={this.classes.root} noValidate autoComplete="off">
            <Box>
              <TextField
                label="Username"
                data-hook={userNameHook}
                onChange={event => this.setUsername(event)}
              />
              <TextField
                label="Password"
                onChange={event => this.setPassword(event)}
                data-hook={passwordHook}
                type="password"
              />
            </Box>
            <BaseButton
              name="Login"
              data-hook={loginHook}
              onClick={() =>
                this.props.handleLogin(
                  this.state.username,
                  this.state.password,
                  this.props.onLogin
                )
              }
            />
          </form>
        </Box>
      </>
    );
  }
}
export default Login;
