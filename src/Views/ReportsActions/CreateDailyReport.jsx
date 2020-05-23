import React from "react";
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
import { handleGetFieldsGeneralDailyReport } from "../../Handlers/Handlers";

const columns = [
  { title: "Product name", field: "productName", editable: "never" },
  {
    title: "Quantity sold",
    field: "quantitySold"
  },
  { title: "Stock thrown", field: "stockThrown" }
];

const style = { justifyContent: "center", top: "auto" };

export default class CreateDailyReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setInitialState();
  }

  setInitialState() {
    handleGetFieldsGeneralDailyReport()
      .then(response => response.json())
      .then(state => {
        let generalFields = [];
        state.result.length &&
          state.result.forEach(obj => generalFields.push(obj.title));
        this.setState({ generalFields });
      });
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

  createGeneralReport = () => {
    const { generalContent } = this.state;
    return {
      type: reportsTypesObj.General,
      content: [generalContent || {}]
    };
  };

  createReport = () => {
    const incomes = this.createIncomeReport();
    const inventory = this.createInventoryReport();
    const general = this.createGeneralReport();

    return general ? [incomes, inventory, general] : [incomes, inventory];
  };

  generateDynamicGeneralFields = () => {
    let dynamicGeneralFields = [];
    const { generalFields } = this.state;

    generalFields.forEach(field => {
      let dynamicField = (
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText={field}
            id={field}
            formControlProps={{
              fullWidth: true
            }}
            onChange={event => {
              const state = {};
              state[field] = event.target.value;
              this.setState({
                generalContent: { ...this.state.generalContent, ...state }
              });
            }}
            data-hook={field}
          />
        </GridItem>
      );
      dynamicGeneralFields.push(dynamicField);
    });

    return dynamicGeneralFields;
  };

  isAllFieldsFilled = () =>
    this.state.numOfTabsSales &&
    this.state.cafeteriaCashRevenues &&
    this.state.cafeteriaCreditCardRevenues &&
    this.state.ticketsCashRevenues &&
    this.state.ticketsCreditCardRevenues &&
    this.state.tabsCashRevenues &&
    this.state.tabsCreditCardRevenues &&
    this.state.data;

  render() {
    const { generalFields } = this.state;
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

        {generalFields && generalFields.length > 0 && (
          <GridContainer style={style}>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="info" style={{ maxHeight: "50px" }}>
                  <h4 style={{ margin: "auto" }}>General</h4>
                  <p>Complete the fields below</p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    {this.generateDynamicGeneralFields()}
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        )}
        <CardFooter style={{ justifyContent: "center" }}>
          <Button
            color="info"
            onClick={() => {
              if (this.isAllFieldsFilled()) {
                const report = this.createReport();
                this.props.handleCreateDailyReports(report);
              } else {
                alert("All fields are required.");
              }
            }}
          >
            Create Daily Report
          </Button>
        </CardFooter>
      </div>
    );
  }
}
