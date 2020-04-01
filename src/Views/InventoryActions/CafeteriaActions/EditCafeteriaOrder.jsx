import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import SelectDates from "../../../Components/SelectDates";
import {
  handleGetItemsByDates,
  handleGetProductsByOrder
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class EditCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      productName: "",
      orderDate: "",
      productQuantity: "",
      isOpened: false,
      openSecond: false
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
  }

  handleGetItemsByDates = (startDate, endDate) => {
    handleGetItemsByDates(startDate, endDate)
      .then(response => response.json())
      .then(state => this.setState({ orders: state.result }));
  };

  handleGetProductsByOrder = orderId => {
    handleGetProductsByOrder(orderId)
      .then(response => response.json())
      .then(state => this.setState({ products: state.result }));
  };

  toggleBox() {
    this.handleGetItemsByDates(this.state.startDate, this.state.endDate);
    this.setState(oldState => ({ isOpened: !oldState.isOpened }));
  }

  toggleSecondBox() {
    this.handleGetProductsByOrder(this.state.orderId);
    this.setState(oldState => ({ openSecond: !oldState.openSecond }));
  }

  setStartDate = date => {
    this.setState({ startDate: date });
  };

  setEndDate = date => {
    this.setState({ endDate: date });
  };

  setOrderName = name => {
    this.setState({ orderId: name });
    this.toggleSecondBox();
  };

  setProuctName = name => {
    this.setState({ productName: name });
  };

  setOrderDate = date => {
    this.setState({ orderDate: date });
  };

  setProuctQuantity(event) {
    this.setState({ productQuantity: event.target.value });
  }

  render() {
    const {
      orderId,
      productName,
      orderDate,
      productQuantity,
      isOpened,
      openSecond
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Edit Cafeteria Order</h4>
                <p>Complete order's changes</p>
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
                  <GridItem xs={12} sm={12} md={6}>
                    <SelectDates
                      id={"remove-end-date"}
                      label={"Choose End Date"}
                      setDate={this.setEndDate}
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
                        id={"orderId"}
                        items={this.state.orders}
                        boxLabel={"Choose order from the list"}
                        setName={this.setOrderName}
                        isMultiple={false}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
              {openSecond && (
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <ComboBox
                        id={"productName"}
                        items={this.state.products}
                        boxLabel={"Choose product from the list"}
                        setName={this.setProuctName}
                        isMultiple={true}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem>
                      <SelectDates
                        id={"add-order-date"}
                        label={"Change Order Date"}
                        setDate={this.setOrderDate}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="Product Quantity"
                        id="productQuantity"
                        formControlProps={{
                          fullWidth: true
                        }}
                        onChange={event => this.setProuctQuantity(event)}
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
                      this.props.handleEditCafeteriaOrder(
                        orderId,
                        productName,
                        orderDate,
                        productQuantity
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
