/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function ComboBox(props) {
  const [value, setValue] = React.useState(null);

  const handleChange = (event, newValue) => {
    props.setName((newValue && newValue.title) || "");
    setValue(newValue);
  };

  return (
    <Autocomplete
      value={value}
      id={props.id}
      options={props.items}
      getOptionLabel={option => option.title}
      style={{ width: 400 }}
      renderInput={params => (
        <TextField {...params} label={props.boxLabel} variant="outlined" />
      )}
      onChange={handleChange}
    />
  );
}
