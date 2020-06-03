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
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import SelectDates from "../../../Components/SelectDates";
import SimpleTable from "../../../Components/Tables/SimpleTable";
import {
  handleGetCafeteriaProducts,
  handleGetSuppliers,
} from "../../../Handlers/Handlers";
import { userNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class AddCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: "",
      orderDate: new Date(),
      addMore: true,
      product: "",
      quantity: "",
      arrayOfProducts: [],
      clearField: false,
    };
    this.checkValidate = true;
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaProducts()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ products: state.result });
      });
    handleGetSuppliers(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ suppliers: state.result });
      });
  };

  stopAddmore = () => {
    this.setState((oldState) => ({ addMore: !oldState.addMore }));
  };

  setQuantity(event) {
    this.setState({ quantity: event.target.value });
  }

  setProduct = (name) => {
    this.setState({ product: name, clearField: false });
  };

  setArrayOfProducts = () => {
    this.validateInput();
    if (this.checkValidate) {
      this.setState({
        arrayOfProducts: [
          ...this.state.arrayOfProducts,
          {
            name: this.state.product,
            quantity: this.state.quantity,
          },
        ],
        clearField: true,
        product: "",
        quantity: "",
      });
      document.getElementById("quantity").value = "";
      this.removeSelectedProduct(this.state.product);
    }
  };

  setOrderDate = (date) => {
    this.setState({ orderDate: date });
  };

  setSupplierName = (event) => {
    this.setState({ supplierName: event });
  };

  removeSelectedProduct(productName) {
    const { products } = this.state;
    const newArr = products.filter((e) => e.title !== productName);
    this.setState({ products: newArr });
  }

  columns = [
    { title: "Product Name", field: "name" },
    { title: "Quantity", field: "expectedQuantity" },
  ];

  validateInput() {
    console.log("quantity:", this.state.quantity);
    if (this.state.quantity === "" || this.state.product === "") {
      alert("product and quantity are required");
      this.checkValidate = false;
    } else if (this.state.quantity === "0") {
      alert("product quantity must be greater than 0");
      this.checkValidate = false;
    } else {
      this.checkValidate = true;
    }
  }

  render() {
    const {
      supplierName,
      orderDate,
      addMore,
      arrayOfProducts,
      clearField,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Add new Cafeteria Order</h4>
                <p>Complete order's details</p>
              </CardHeader>
              {addMore && (
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <ComboBox
                        id={"productsName"}
                        items={this.state.products}
                        boxLabel={"Choose product"}
                        setName={this.setProduct}
                        isMultiple={false}
                        clearField={clearField}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Set Product Quantity"
                        id="quantity"
                        inputProps={{
                          type: "number",
                        }}
                        formControlProps={{
                          fullWidth: true,
                        }}
                        onChange={(event) => this.setQuantity(event)}
                      />
                    </GridItem>
                  </GridContainer>
                  <CardFooter style={{ justifyContent: "center" }}>
                    <Button color="info" onClick={this.setArrayOfProducts}>
                      Add Product
                    </Button>
                  </CardFooter>
                </CardBody>
              )}
              {addMore && (
                <CardFooter style={{ justifyContent: "center" }}>
                  <Button color="info" onClick={this.stopAddmore}>
                    Finish add products
                  </Button>
                </CardFooter>
              )}
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <ComboBox
                      id={"supplierName"}
                      items={this.state.suppliers}
                      boxLabel={"Choose supplier"}
                      setName={this.setSupplierName}
                      isMultiple={false}
                      data-hook={userNameHook}
                    />
                  </GridItem>
                  <GridItem>
                    <SelectDates
                      id={"add-order-date"}
                      label={"Choose Order Date"}
                      setDate={this.setOrderDate}
                      date={this.state.orderDate}
                    />
                  </GridItem>
                </GridContainer>
                {!addMore && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <h3 style={{ margin: "auto", marginTop: "20px" }}>
                        Order's products details:{" "}
                      </h3>
                      <SimpleTable
                        colums={this.columns}
                        data={arrayOfProducts}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  id={"addCafeteriaOrder"}
                  color="info"
                  onClick={() =>
                    this.props.handleAddCafeteriaOrder(
                      arrayOfProducts,
                      supplierName,
                      orderDate
                    )
                  }
                >
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
