import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import moment from "moment";

export default function SelectDates(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(props.date);

  const handleDateChange = date => {
    let dateSelected = moment(date);
    props.setDate(dateSelected.format());
    setSelectedDate(dateSelected);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ width: "auto" }}>
      <Grid
        container
        style={{ marginTop: "-10px", marginLeft: "20px", width: "auto" }}
      >
        <KeyboardDatePicker
          margin="normal"
          id={props.id}
          label={props.label}
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
