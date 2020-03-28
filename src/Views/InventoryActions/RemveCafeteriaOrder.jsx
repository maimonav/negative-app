import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Button from "../../Components/CustomButtons/Button.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import ComboBox from "../../Components/AutoComplete";
import { exampleNames } from "../../consts/data";
import SelectDates from "../../Components/SelectDates";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      startDate: "",
      endDate: "",
      orderName: ""
    };
    this.toggleBox = this.toggleBox.bind(this);
  }

  toggleBox() {
    this.props.handleGetItemsByDates(this.state.startDate, this.state.endDate)
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
              <CardHeader color="info">
                <h4>Remvoe Cafeteria Order</h4>
                <p>Choose order's number</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-start-date"}
                      label={"Choose Start Date"}
                      setDate={this.setStartDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-end-date"}
                      label={"Choose End Date"}
                      setDate={this.setEndDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <Button
                    color="info"
                    onClick={this.toggleBox}
                  >
                    Choose dates
                  </Button>
                </GridContainer>
                {isOpened && <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"orderName"}
                      items={exampleNames}
                      boxLabel={"Choose order from the list"}
                      setName={this.setOrderName}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>}
              </CardBody>
              {isOpened && <CardFooter>
                <Button
                  color="info"
                  onClick={() => this.props.handleRemoveCafeteriaOrder(orderName)}
                >
                  Remove Order
                </Button>
              </CardFooter>}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
