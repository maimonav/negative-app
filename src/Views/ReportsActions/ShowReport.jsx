import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import DownloadIcon from "@material-ui/icons/SaveAlt";
import CardBody from "../../Components/Card/CardBody.js";
import ComboBox from "../../Components/AutoComplete";
import Button from "../../Components/CustomButtons/Button.js";
import SelectDates from "../../Components/SelectDates";
import Tooltip from "@material-ui/core/Tooltip";
import ReportTable from "../../Components/Tables/ReportTable";
import {
  handleGetReport,
  HandleGetFullDailyReport,
  handleGetReportFile
} from "../../Handlers/Handlers";
import {
  reportsTypes,
  reportsPrettyTypes,
  reportsTypesInverseObj
} from "../../consts/data";
import { downloadActionHook } from "../../consts/data-hooks";
import { IconButton } from "@material-ui/core";
const style = { justifyContent: "center", top: "auto" };

export default class ShowReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: "",
      fromDate: new Date(),
      toDate: new Date()
    };
  }

  setReportType = reportType => {
    this.setState({ reportType: reportsTypes[reportType] });
    this.resetData();
  };

  setFromDate = fromDate => {
    this.setState({ fromDate: new Date(fromDate) });
  };

  setToDate = toDate => {
    this.setState({ toDate: new Date(toDate) });
  };

  resetData = () => {
    this.setState({ reportData: undefined });
  };

  setReport = () => {
    (this.state.reportType === reportsTypes.Daily
      ? HandleGetFullDailyReport(
          this.state.fromDate,
          this.state.toDate,
          localStorage.getItem("username")
        )
      : handleGetReport(
          this.state.reportType,
          this.state.fromDate,
          this.state.toDate,
          localStorage.getItem("username")
        )
    )
      .then(response => response.json())
      .then(state => {
        if (typeof state.result !== "string") {
          this.setState({ reportData: state.result });
        } else {
          alert(state.result);
        }
      });
  };

  handleDownloadReportFile = () => {
    handleGetReportFile(
      this.state.reportType,
      this.state.fromDate,
      this.state.toDate,
      localStorage.getItem("username")
    ).then(response => {
      const fileName = response.headers.get("fileName");
      if (fileName) {
        response.blob().then(blob => {
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("hidden", "");
            a.setAttribute("href", url);
            a.setAttribute(
              "download",
              `${fileName} ${this.state.fromDate.toDateString()} - ${this.state.toDate.toDateString()}.xlsx`
            );
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            alert("Something went wrong..");
          }
        });
      } else {
        response.json().then(state => state.result && alert(state.result));
      }
    });
  };

  renderReport = () => {
    const isFullReport = this.state.reportType === reportsTypes.Daily;
    if (!isFullReport) {
      return (
        <ReportTable
          data={this.state.reportData}
          reportType={this.state.reportType}
        />
      );
    } else {
      const reports = [];
      this.state.reportData.forEach(report => {
        const reportComponent = (
          <GridItem xs={12} sm={12} md={6}>
            <h1>
              {reportsTypesInverseObj[report.type]}
              <ReportTable data={report.content} reportType={report.type} />
            </h1>
          </GridItem>
        );
        reports.push(reportComponent);
      });
      return reports;
    }
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={12}>
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
                    id={"choose-from-date"}
                    label={"Choose from date"}
                    setDate={this.setFromDate}
                    date={this.state.fromDate}
                  />
                  <SelectDates
                    id={"choose-to-date"}
                    label={"Choose to date"}
                    setDate={this.setToDate}
                    date={this.state.toDate}
                  />
                  <Button
                    color="info"
                    onClick={() => {
                      if (
                        this.state.reportType &&
                        this.state.fromDate &&
                        this.state.toDate
                      ) {
                        this.setReport();
                      } else {
                        alert("All fields are required.");
                      }
                    }}
                    style={{ marginLeft: "15px", marginTop: "10px" }}
                  >
                    Show report
                  </Button>
                  {this.state.reportData &&
                    this.state.reportType !== reportsTypes.Daily && (
                      <Tooltip title="Download report" aria-label="show">
                        <IconButton
                          color="default"
                          size="medium"
                          onClick={this.handleDownloadReportFile}
                          data-hook={downloadActionHook}
                          style={{ marginLeft: "15px", marginTop: "10px" }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                </div>
                {this.state.reportType &&
                  this.state.fromDate &&
                  this.state.toDate &&
                  this.state.reportData &&
                  this.renderReport()}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
