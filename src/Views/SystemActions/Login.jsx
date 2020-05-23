import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import BaseButton from "../../Components/Button";
import { Box } from "@material-ui/core";
import CryptoJS from "crypto-js";
import {
  userNameHook,
  passwordHook,
  actionButtonHook
} from "../../consts/data-hooks";
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
    const password = CryptoJS.AES.encrypt(
      event.target.value,
      "Password"
    ).toString();
    this.setState({ password });
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
                id="loginusername"
              />
              <TextField
                label="Password"
                onChange={event => this.setPassword(event)}
                data-hook={passwordHook}
                type="password"
                id="loginpassword"
              />
            </Box>
            <BaseButton
              name="Login"
              data-hook={actionButtonHook}
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
