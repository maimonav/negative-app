import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./ErrorPage.scss";
import { LogFile } from "../Views";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { logFilePath } from "../consts/paths";
import DescriptionIcon from "@material-ui/icons/Description";
import IconButton from "@material-ui/core/IconButton";

export default class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     error: this.props.messageError[0].content,
  //   });
  // }

  render() {
    const { error } = this.state;
    const { userName, permission } = this.props;
    return (
      <Box className="error">
        <h1>Oops, There was a problem launching your web site</h1>
        {/* <Typography style={{ paddingTop: "35px" }}>{error}</Typography> */}
        {userName === "admin" ? (
          <Router>
            <Link
              to={logFilePath}
              style={{ marginLeft: "auto", marginRight: "30px" }}
            >
              <IconButton color="inherit" aria-label="logFile">
                <DescriptionIcon />
              </IconButton>
            </Link>
          </Router>
        ) : (
          ""
        )}
      </Box>
    );
  }
}
