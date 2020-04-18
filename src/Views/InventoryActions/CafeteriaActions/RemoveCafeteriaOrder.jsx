import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import { handleGetOrdersByDates } from "../../../Handlers/Handlers";
import SelectDates from "../../../Components/SelectDates";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      startDate: new Date(),
      endDate: new Date(),
      orderName: ""
    };
    this.toggleBox = this.toggleBox.bind(this);
  }

  handleGetOrdersByDates = (startDate, endDate) => {
    handleGetOrdersByDates(startDate, endDate)
      .then(response => response.json())
      .then(state => this.setState({ orders: state.result }));
  };

  toggleBox() {
    this.handleGetOrdersByDates(this.state.startDate, this.state.endDate);
    this.setState(oldState => ({ isOpened: !oldState.isOpened }));
  }

  setOrderName = name => {
    this.setState({ orderName: name });
  };

  setStartDate = date => {
    this.setState({ startDate: date });
  };

  setEndDate = date => {
    this.setState({ endDate: date });
  };

  render() {
    const { orderName, isOpened } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Remvoe Cafeteria Order</h4>
                <p>Choose order's number</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-start-date"}
                      label={"Choose Start Date"}
                      setDate={this.setStartDate}
                      date={this.state.startDate}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-end-date"}
                      label={"Choose End Date"}
                      setDate={this.setEndDate}
                      date={this.state.endDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ justifyContent: "center" }}>
                  <Button color="info" onClick={this.toggleBox}>
                    Choose dates
                  </Button>
                </GridContainer>
              </CardBody>
              <CardBody>
                {isOpened && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <ComboBox
                        id={"orderName"}
                        items={this.state.orders}
                        boxLabel={"Choose order"}
                        setName={this.setOrderName}
                        isMultiple={false}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
              {isOpened && (
                <CardFooter>
                  <Button
                    color="info"
                    onClick={() =>
                      this.props.handleRemoveCafeteriaOrder(orderName)
                    }
                  >
                    Remove Order
                  </Button>
                </CardFooter>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
