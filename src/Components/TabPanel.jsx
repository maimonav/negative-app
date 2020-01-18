import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default function TablPanel(props) {
  const [value, setValue] = React.useState(props.tabNumber);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handleTabChange && props.handleTabChange(newValue);
  };

  return (
    <Paper square>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="tabs"
      >
        <Tab label="Home" />
        {!props.isUserLogged && <Tab label="Login" />}
        {!props.isUserLogged && <Tab label="Register" />}
        {props.isUserLogged && <Tab label="Logout" />}
      </Tabs>
    </Paper>
  );
}
