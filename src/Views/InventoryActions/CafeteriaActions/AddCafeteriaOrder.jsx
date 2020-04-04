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
  handleGetCafeteriaProducts,
  handleGetSuppliers
} from "../../../Handlers/Handlers";
import EditTable from "../../../Components/Tables/EditTable";
const style = { justifyContent: "center", top: "auto" };

export default class AddCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productsName: "",
      supplierName: "",
      orderDate: new Date(),
      productsWithQuantity: "",
      isOpened: false,
      openSecond: false
    };
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaProducts(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ products: state.result });
      });
    handleGetSuppliers(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ suppliers: state.result });
      });
  };

  toggleBox() {
    this.setState(oldState => ({ isOpened: !oldState.isOpened }));
  }

  toggleSecondBox() {
    this.setState(oldState => ({ openSecond: !oldState.openSecond }));
    this.setState(oldState => ({ isOpened: !oldState.isOpened }));
  }

  setProductsName = name => {
    this.setState({
      productsName: name.map(item => ({ name: item.title, quantity: "" }))
    });
  };

  setProductsWithQuantity = name => {
    this.setState({
      productsWithQuantity: name
    });
  };

  setOrderDate = date => {
    this.setState({ orderDate: date });
  };

  setSupplierName = event => {
    this.setState({ supplierName: event });
  };

  render() {
    const {
      productsName,
      supplierName,
      orderDate,
      productsWithQuantity,
      isOpened,
      openSecond
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Add new Cafeteria Order</h4>
                <p>Complete order's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productsName"}
                      items={this.state.products}
                      boxLabel={"Choose product from the list"}
                      setName={this.setProductsName}
                      isMultiple={true}
                    />
                  </GridItem>
                </GridContainer>
                {!openSecond && (
                  <CardFooter>
                    <Button color="info" onClick={this.toggleBox}>
                      Manage Products Quantity
                    </Button>
                  </CardFooter>
                )}
                {isOpened && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={15}>
                      <EditTable
                        data={productsName}
                        setItems={this.setProductsWithQuantity}
                        openSecondBox={this.toggleSecondBox}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
              {openSecond && (
                <CardBody>
                  <GridContainer>
                    <GridItem>
                      <SelectDates
                        id={"add-order-date"}
                        label={"Choose Order Date"}
                        setDate={this.setOrderDate}
                        date={this.state.orderDate}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <ComboBox
                        id={"supplierName"}
                        items={this.state.suppliers}
                        boxLabel={"Choose supplier from the list"}
                        setName={this.setSupplierName}
                        isMultiple={false}
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
                      this.props.hadleAddCafeteriaOrder(
                        productsWithQuantity,
                        supplierName,
                        orderDate
                      )
                    }
                  >
                    Add New Order
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
