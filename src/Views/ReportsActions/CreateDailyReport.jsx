import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
import Button from "../../Components/CustomButtons/Button.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import { reportsTypesObj } from "../../consts/data";
import CreateReportTable from "../../Components/Tables/CreateReportTable";

const columns = [
  { title: "Product name", field: "productName", editable: "never" },
  {
    title: "Quantity sold",
    field: "quantitySold"
  },
  { title: "Quantity thrown", field: "quantityThrown" }
];

const style = { justifyContent: "center", top: "auto" };

export default class CreateDailyReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setNumOfTabsSales(event) {
    this.setState({ numOfTabsSales: event.target.value });
  }

  setCafeteriaCashRevenues(event) {
    this.setState({ cafeteriaCashRevenues: event.target.value });
  }

  setCafeteriaCreditCardRevenues(event) {
    this.setState({ cafeteriaCreditCardRevenues: event.target.value });
  }

  setTicketsCashRevenues(event) {
    this.setState({ ticketsCashRevenues: event.target.value });
  }

  setTicketsCreditCardRevenues(event) {
    this.setState({ ticketsCreditCardRevenues: event.target.value });
  }

  setTabsCashRevenues(event) {
    this.setState({ tabsCashRevenues: event.target.value });
  }

  setTabsCreditCardRevenues(event) {
    this.setState({ tabsCreditCardRevenues: event.target.value });
  }

  onChangeInventoryData = data => {
    this.setState({ data });
  };

  createIncomeReport = () => {
    return {
      type: reportsTypesObj.Incomes,
      content: [
        {
          numOfTabsSales: this.state.numOfTabsSales,
          cafeteriaCashRevenues: this.state.cafeteriaCashRevenues,
          cafeteriaCreditCardRevenues: this.state.cafeteriaCreditCardRevenues,
          ticketsCashRevenues: this.state.ticketsCashRevenues,
          ticketsCreditCardRevenues: this.state.ticketsCreditCardRevenues,
          tabsCashRevenues: this.state.tabsCashRevenues,
          tabsCreditCardRevenues: this.state.tabsCreditCardRevenues
        }
      ]
    };
  };

  createInventoryReport = () => {
    return {
      type: reportsTypesObj.Inventory,
      content: this.state.data
    };
  };

  //TODO: implement this
  createGeneralReport = () => {
    return {
      type: reportsTypesObj.General,
      content: []
    };
  };

  createReport = () => {
    const incomes = this.createIncomeReport();
    const inventory = this.createInventoryReport();
    // const general = this.createGeneralReport();

    return [incomes, inventory /*general*/];
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Incomes</h4>
                <p>Complete the fields below</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Number Of Tabs Sales"
                      id="numberOfTabsSales"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setNumOfTabsSales(event)}
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Cafeteria Cash Revenues"
                      id="cafeteriaCashRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setCafeteriaCashRevenues(event)}
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Cafeteria Credit Card Revenues"
                      id="cafeteriaCreditCardRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event =>
                        this.setCafeteriaCreditCardRevenues(event)
                      }
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Tickets Cash Revenues"
                      id="ticketsCashRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setTicketsCashRevenues(event)}
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Tickets Credit Card Revenues"
                      id="ticketsCreditCardRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event =>
                        this.setTicketsCreditCardRevenues(event)
                      }
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Tabs Cash Revenues"
                      id="tabsCashRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setTabsCashRevenues(event)}
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Tabs Credit Card Revenues"
                      id="tabsCreditCardRevenues"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setTabsCreditCardRevenues(event)}
                      data-hook={""}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Inventory</h4>
                <p>Complete the table below</p>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ display: "initial" }}>
                  <CreateReportTable
                    columns={columns}
                    onChangeInventoryData={this.onChangeInventoryData}
                  ></CreateReportTable>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        {/* <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>General</h4>
                <p>Complete the fields below</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Cash Counted"
                      id="cashCounted"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setCashCounted(event)}
                      data-hook={""}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Report Z Taken"
                      id="reportZTaken"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setReportZTaken(event)}
                      data-hook={""}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer> */}
        <CardFooter style={{ justifyContent: "center" }}>
          <Button
            color="info"
            onClick={() => {
              const report = this.createReport();
              this.props.handleCreateDailyReports(report);
            }}
          >
            Create Daily Report
          </Button>
        </CardFooter>
      </div>
    );
  }
}
