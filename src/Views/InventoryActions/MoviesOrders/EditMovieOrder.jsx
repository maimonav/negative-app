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
  handleGetMovieOrders,
  handleGetOrdersByDates,
  handleGetProductsAndQuantityByOrder,
} from "../../../Handlers/Handlers";
import { orderNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class EditMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      orderId: "",
      orderDate: new Date(),
      updatedMovies: "",
      isOpened: false,
      openSecond: false,
      openThird: false,
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
    this.toggleThirdBox = this.toggleThirdBox.bind(this);
  }

  handleGetOrdersByDates = (startDate, endDate) => {
    handleGetOrdersByDates(startDate, endDate, false)
      .then((response) => response.json())
      .then((state) => this.setState({ orders: state.result }));
  };

  handleGetProductAndQuntityByOrder = (orderId) => {
    handleGetProductsAndQuantityByOrder(orderId)
      .then((response) => response.json())
      .then((state) => this.setState({ movies: state.result }));
  };

  handleGetMovieOrders = () => {
    handleGetMovieOrders()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ orders: state.result });
      });
  };

  toggleBox() {
    this.handleGetOrdersByDates(this.state.startDate, this.state.endDate);
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

  setOrderDate = (date) => {
    this.setState({ orderDate: date });
  };

  setUpdatedMovies = (name) => {
    this.setState({
      updatedMovies: name,
    });
  };

  columns = [{ title: "Movie Name", field: "name", editable: "never" }];

  render() {
    const {
      orderId,
      movies,
      orderDate,
      updatedMovies,
      isOpened,
      openSecond,
      openThird,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Edit Movie Order</h4>
                <p>Complete order's changes</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"choose-start-date"}
                      label={"Choose Start Date"}
                      setDate={this.setStartDate}
                      date={this.state.startDate}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"chose-end-date"}
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
                  <GridContainer
                    style={{ justifyContent: "center", marginTop: "10px" }}
                  >
                    {orderId && (
                      <Button
                        id={"chooseOrder"}
                        color="info"
                        onClick={this.toggleSecondBox}
                      >
                        Choose order
                      </Button>
                    )}
                  </GridContainer>
                </CardBody>
              )}
              {openSecond && (
                <CardBody>
                  <GridContainer>
                    <GridItem>
                      <SelectDates
                        id={"add-order-date"}
                        label={"Change Order Date"}
                        setDate={this.setOrderDate}
                        date={this.state.orderDate}
                      />
                    </GridItem>
                  </GridContainer>
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
                      this.props.handleEditMovieOrder(
                        orderId,
                        orderDate,
                        updatedMovies
                      )
                    }
                  >
                    Edit Order
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
