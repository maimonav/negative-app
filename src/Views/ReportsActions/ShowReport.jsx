import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import ComboBox from "../../Components/AutoComplete";
import Button from "../../Components/CustomButtons/Button.js";
import SelectDates from "../../Components/SelectDates";
import ReactVirtualizedTable from "../../Components/Tables/ReportTable";
import {
  // handleGetReportTypes,
  handleGetReport,
  // handleGetInventoryReport,
  // handleGetIncomesReport,
  handleGetGeneralReport
} from "../../Handlers/Handlers";
import { reportsTypes, reportsPrettyTypes } from "../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class ShowReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: "",
      date: new Date()
    };
    // this.setInitialState();
  }

  // setInitialState = () => {
  //   handleGetReportTypes(localStorage.getItem("username"))
  //     .then(response => response.json())
  //     .then(state => {
  //       this.setState({ types: state.result });
  //     });
  // };

  setReportType = reportType => {
    this.setState({ reportType: reportsTypes[reportType] });
    this.resetData();
  };

  setDate = date => {
    this.setState({ date });
  };

  resetData = () => {
    this.setState({ reportData: undefined });
  };

  setReport = () => {
    // console.log(
    //   this.state.reportType,
    //   this.state.date,
    //   localStorage.getItem("username")
    // );
    handleGetReport(
      this.state.reportType,
      this.state.date,
      localStorage.getItem("username")
    )
      .then(response => response.json())
      .then(state => {
        this.setState({ reportData: state.result });
      });
    // if (this.state.reportType === "inventory_daily_report") {
    //   handleGetInventoryReport()
    //     .then(response => response.json())
    //     .then(state => {
    //       this.setState({ reportData: state.result });
    //     });
    // } else if (this.state.reportType === "incomes_daily_report") {
    //   handleGetIncomesReport()
    //     .then(response => response.json())
    //     .then(state => {
    //       this.setState({ reportData: state.result });
    //     });
    // }
    // else if (this.state.reportType === "general_purpose_daily_report") {
    //   handleGetGeneralReport()
    //     .then(response => response.json())
    //     .then(state => {
    //       this.setState({ reportData: state.result });
    //     });
    // }
    // else {
    //   this.resetData();
    // }
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show Report</h4>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <ComboBox
                    id={"reportType"}
                    items={reportsPrettyTypes || []}
                    boxLabel={"Choose type"}
                    setName={this.setReportType}
                    isMultiple={false}
                  />
                  <SelectDates
                    id={"remove-start-date"}
                    label={"Choose Date"}
                    setDate={this.setDate}
                    style={{ width: "auto" }}
                    date={this.state.date}
                  />
                  <Button
                    color="info"
                    onClick={() => {
                      this.setReport();
                    }}
                    style={{ marginLeft: "15px", marginTop: "10px" }}
                  >
                    Show report
                  </Button>
                </div>
                {this.state.reportType &&
                  this.state.date &&
                  this.state.reportData && (
                    <ReactVirtualizedTable
                      data={this.state.reportData}
                      reportType={this.state.reportType}
                    />
                  )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
