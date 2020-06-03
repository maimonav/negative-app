import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./ErrorPage.scss";

export default class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
  }

  componentDidMount() {
    console.log("props:", this.props);
    this.setState({
      error: this.props.messageError[0].content,
    });
  }

  render() {
    const { error } = this.state;
    return (
      <Box className="error">
        <h1>Oops, There was a problem launching your web site</h1>
        <Typography style={{ paddingTop: "35px" }}>{error}</Typography>
      </Box>
    );
  }
}
