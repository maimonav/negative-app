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
import EditTable from "../../../Components/Tables/EditTable";
import {
  handleGetOrdersByDates,
  handleGetProductsAndQuantityByOrder,
} from "../../../Handlers/Handlers";
import { orderNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ConfirmMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      isOpened: false,
      openSecond: false,
      openThird: false,
      startDate: new Date(),
      endDate: new Date(),
      updatedMovies: "",
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
    this.toggleThirdBox = this.toggleThirdBox.bind(this);
  }

  handleGetItemsByDates = (startDate, endDate) => {
    handleGetOrdersByDates(startDate, endDate, false)
      .then((response) => response.json())
      .then((state) => this.setState({ orders: state.result }));
  };

  handleGetProductAndQuntityByOrder = (orderId) => {
    handleGetProductsAndQuantityByOrder(orderId)
      .then((response) => response.json())
      .then((state) => this.setState({ movies: state.result }));
  };

  toggleBox() {
    this.handleGetItemsByDates(this.state.startDate, this.state.endDate);
    this.setState((oldState) => ({ isOpened: !oldState.isOpened }));
  }

  toggleSecondBox() {
    this.handleGetProductAndQuntityByOrder(this.state.orderId);
    this.setState((oldState) => ({ openSecond: !oldState.openSecond }));
  }

  toggleThirdBox() {
    this.setState((oldState) => ({ openThird: !oldState.openThird }));
    this.setState((oldState) => ({ openSecond: !oldState.openSecond }));
    this.setState((oldState) => ({ isOpened: !oldState.isOpened }));
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

  setUpdatedMovies = (name) => {
    this.setState({
      updatedMovies: name,
    });
  };

  columns = [
    { title: "Movie Name", field: "name" },
    { title: "Key", field: "key" },
    { title: "Examination room", field: "examinationRoom" },
  ];

  render() {
    const {
      startDate,
      endDate,
      orderId,
      movies,
      updatedMovies,
      isOpened,
      openSecond,
      openThird,
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
                        data-hook={orderNameHook}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer style={{ justifyContent: "center" }}>
                    {orderId && (
                      <Button color="info" onClick={this.toggleSecondBox}>
                        Choose order
                      </Button>
                    )}
                  </GridContainer>
                </CardBody>
              )}
              {openSecond && (
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={15}>
                      <EditTable
                        columns={this.columns}
                        data={movies}
                        setItems={this.setUpdatedMovies}
                        openSecondBox={this.toggleThirdBox}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              )}
              {openThird && (
                <CardFooter style={{ justifyContent: "center" }}>
                  <Button
                    color="info"
                    onClick={() =>
                      this.props.handleConfirmMovieOrder(orderId, updatedMovies)
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
