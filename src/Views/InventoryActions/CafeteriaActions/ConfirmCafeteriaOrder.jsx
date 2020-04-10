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
import {
  handleGetItemsByDates,
  handleGetProductsAndQuantityByOrder,
} from "../../../Handlers/Handlers";
import EditTable from "../../../Components/Tables/EditTable";
const style = { justifyContent: "center", top: "auto" };

export default class ConfirmCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      isOpened: false,
      openSecond: false,
      openThird: false,
      startDate: new Date(),
      endDate: new Date(),
      updatedProducts: "",
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
    this.toggleThirdBox = this.toggleThirdBox.bind(this);
  }

  handleGetItemsByDates = (startDate, endDate) => {
    handleGetItemsByDates(startDate, endDate)
      .then((response) => response.json())
      .then((state) => this.setState({ orders: state.result }));
  };

  handleGetProductAndQuntityByOrder = (orderId) => {
    handleGetProductsAndQuantityByOrder(
      localStorage.getItem("username"),
      orderId
    )
      .then((response) => response.json())
      .then((state) => this.setState({ productsWithQuantity: state.result }));
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

  setProductsWithQuantity = (name) => {
    this.setState({
      updatedProducts: name,
    });
  };

  columns = [
    { title: "Product Name", field: "name" },
    { title: "Quantity", field: "quantity" },
    { title: "New Quantity", field: "new-quantity" },
  ];

  render() {
    const {
      startDate,
      endDate,
      orderId,
      updatedProducts,
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
                        boxLabel={"Choose order from the list"}
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
                      <EditTable
                        columns={this.columns}
                        data={this.state.productsWithQuantity}
                        setItems={this.setProductsWithQuantity}
                        openSecondBox={this.toggleThirdBox}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              )}
              {openThird && (
                <CardFooter>
                  <Button
                    color="info"
                    onClick={() =>
                      this.props.handleConfirmCafeteriaOrder(
                        this.state.productsWithQuantity,
                        orderId,
                        updatedProducts
                      )
                    }
                  >
                    Confirm Order
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
