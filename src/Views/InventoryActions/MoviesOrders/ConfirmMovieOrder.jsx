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
import SelectDates from "../../../Components/SelectDates";
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import { handleGetOrdersByDates } from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ConfirmMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      isOpened: false,
      openSecond: false,
      startDate: new Date(),
      endDate: new Date(),
      key: "",
      examinationRoom: "",
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
  }

  handleGetItemsByDates = (startDate, endDate) => {
    handleGetOrdersByDates(startDate, endDate)
      .then((response) => response.json())
      .then((state) => this.setState({ orders: state.result }));
  };

  toggleBox() {
    this.handleGetItemsByDates(this.state.startDate, this.state.endDate);
    this.setState((oldState) => ({ isOpened: !oldState.isOpened }));
  }

  toggleSecondBox() {
    this.setState((oldState) => ({ openSecond: !oldState.openSecond }));
  }

  setStartDate = (date) => {
    this.setState({ startDate: date });
  };

  setEndDate = (date) => {
    this.setState({ endDate: date });
  };

  setOrderName = (name) => {
    this.setState({ orderId: name });
  };

  setKey = (event) => {
    this.setState({ key: event.target.value });
  };

  setExaminationRoom = (event) => {
    this.setState({ examinationRoom: event.target.value });
  };

  render() {
    const {
      startDate,
      endDate,
      orderId,
      key,
      examinationRoom,
      isOpened,
      openSecond,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Confirm Cafeteria Order</h4>
                <p>Complete order's changes</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-start-date"}
                      label={"Choose Start Date"}
                      setDate={this.setStartDate}
                      date={startDate}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-end-date"}
                      label={"Choose End Date"}
                      setDate={this.setEndDate}
                      date={endDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ justifyContent: "center" }}>
                  <Button color="info" onClick={this.toggleBox}>
                    Choose dates
                  </Button>
                </GridContainer>
              </CardBody>
              {isOpened && (
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <ComboBox
                        id={"orderId"}
                        items={this.state.orders}
                        boxLabel={"Choose order"}
                        setName={this.setOrderName}
                        isMultiple={false}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer style={{ justifyContent: "center" }}>
                    <Button color="info" onClick={this.toggleSecondBox}>
                      Choose order
                    </Button>
                  </GridContainer>
                </CardBody>
              )}
              {openSecond && (
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={15}>
                      <CustomInput
                        labelText="Movie Key"
                        id="key"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        onChange={(event) => this.setKey(event)}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="Movie Examination room"
                        id="examinationRoom"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        onChange={(event) => this.setExaminationRoom(event)}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              )}
              {openSecond && (
                <CardFooter>
                  <Button
                    color="info"
                    onClick={() =>
                      this.props.handleConfirmMovieOrder(
                        orderId,
                        key,
                        examinationRoom
                      )
                    }
                  >
                    Confirm Movie Order
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
