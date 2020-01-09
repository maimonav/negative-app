import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default function TablPanel(props) {
  const [value, setValue] = React.useState(props.tabNumber);
  let disabled = true;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1 || newValue === 2) {
      disabled = !disabled;
    }
    props.handleChange(newValue);
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
        <Tab label="Login" />
      </Tabs>
    </Paper>
  );
}
