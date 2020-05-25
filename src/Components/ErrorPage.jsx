import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./ErrorPage.scss";

export default class RecipeReviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Box className="error">
        <h1>Oops, There was a problem launching your web site</h1>
        <Typography style={{ paddingTop: "35px" }}>
          Server initialization error, Database Error: Cannot complete action.
          Error ID: 2ed0x7yskadr7hmf
        </Typography>
      </Box>
    );
  }
}
