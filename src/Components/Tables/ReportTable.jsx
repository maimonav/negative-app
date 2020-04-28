import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";

const styles = theme => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    "& .ReactVirtualized__Table__headerRow": {
      flip: false,
      paddingRight: theme.direction === "rtl" ? "0px !important" : undefined
    }
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

class ReportTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit"
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

ReportTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
};

const VirtualizedTable = withStyles(styles)(ReportTable);

const InventoryColumns = [
  {
    width: 200,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 150,
    label: "Product",
    dataKey: "product"
  },
  {
    width: 150,
    label: "Employee",
    dataKey: "employee"
  },
  {
    width: 150,
    label: "Quantity Sold",
    dataKey: "quantity_sold",
    numeric: true
  },
  {
    width: 150,
    label: "Quantity In Stock",
    dataKey: "quantity_in_stock",
    numeric: true
  },
  {
    width: 150,
    label: "Stock Thrown",
    dataKey: "stock_thrown",
    numeric: true
  }
];

const IncomesColumns = [
  {
    width: 150,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 120,
    label: "Employee",
    dataKey: "employee"
  },
  {
    width: 120,
    label: "Tabs Sales",
    dataKey: "numOfTabsSales",
    numeric: true
  },
  {
    width: 200,
    label: "Cafeteria Credit Incomes",
    dataKey: "cafeteriaCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets Cash Incomes",
    dataKey: "ticketsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets Credit Incomes",
    dataKey: "ticketsCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs Cash Incomes",
    dataKey: "tabsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs Credit Incomes",
    dataKey: "tabsCreditCardRevenues",
    numeric: true
  }
];

const columns = {
  inventory_daily_report: InventoryColumns,
  general_purpose_daily_report: [],
  incomes_daily_report: IncomesColumns,
  movie_daily_report: []
};

export default function ReactVirtualizedTable(props) {
  console.log(columns[props.reportType]);
  return (
    <Paper style={{ height: 450, width: "100%" }}>
      <VirtualizedTable
        rowCount={props.data.length}
        rowGetter={({ index }) => props.data[index]}
        columns={columns[props.reportType]}
      />
    </Paper>
  );
}
