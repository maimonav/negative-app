import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { colums, data } = this.props;
    console.log("data:", data);
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {colums.map((colum) => (
                <TableCell>{colum.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {data && (
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    );
  }
}