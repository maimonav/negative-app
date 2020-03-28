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
import ComboBox from "../../Components/AutoComplete";
import SelectDates from "../../Components/SelectDates";
import { exampleNames } from "../../consts/data";
import {
  handleGetCafeteriaProducts,
  handleGetSuppliers
} from "../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class AddCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      orderDate: "",
      productPrice: "",
      productQuantity: "",
      supplierName: ""
    };
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

  setProuctName = name => {
    this.setState({ productName: name });
  };

  setOrderDate = date => {
    this.setState({ orderDate: date });
  };

  setProuctPrice(event) {
    this.setState({ productPrice: event.target.value });
  }

  setProuctQuantity(event) {
    this.setState({ productQuantity: event.target.value });
  }

  setSupplierName = (event) => {
    this.setState({ supplierName: event });
  }

  render() {
    const {
      productName,
      orderDate,
      productPrice,
      productQuantity,
      supplierName
    } = this.state;
    const isEnabled =  productQuantity.length > 0 &&  productPrice.length > 0;
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
                      id={"productName"}
                      items={this.state.products}
                      boxLabel={"Choose product from the list"}
                      setName={this.setProuctName}
                      isMultiple={true}
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
                <GridContainer>
                  <GridItem >
                    <SelectDates
                      id={"add-order-date"}
                      label={"Choose Order Date"}
                      setDate={this.setOrderDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Product Price"
                      id="productPrice"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setProuctPrice(event)}
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
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Max Quantity"
                      id="productMaxQuantity"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setSupplierName(event)}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" onClick={() => "Clicked"}>
                  Add New Order
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
