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

  const handleMultipleChange = (event, newValue) => {
    props.setName((newValue && newValue) || "");
    setValue(newValue);
  };

  React.useEffect(() => {
    if (props.clearField === true) {
      setValue("");
    }
  }, [props.clearField]);

  return (
    <>
      {!props.isMultiple && (
        <Autocomplete
          value={value}
          id={props.id}
          options={props.items}
          getOptionLabel={(option) => option.title}
          style={{ width: 300, maxWidth: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label={props.boxLabel} variant="outlined" />
          )}
          onChange={handleChange}
          {...props}
        />
      )}
      {props.isMultiple && (
        <Autocomplete
          multiple
          id={props.id}
          options={props.items}
          getOptionLabel={(option) => option.title}
          filterSelectedOptions
          style={{ width: 300, maxWidth: "100%" }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={props.boxLabel} />
          )}
          onChange={handleMultipleChange}
        />
      )}
    </>
  );
}
