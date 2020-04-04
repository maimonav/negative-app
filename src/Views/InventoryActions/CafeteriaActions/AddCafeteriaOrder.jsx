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
  handleGetCafeteriaProducts,
  handleGetSuppliers
} from "../../../Handlers/Handlers";
import MaterialTableDemo from "../../../Components/Tables/EditTable";
const style = { justifyContent: "center", top: "auto" };

export default class AddCafeteriaOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productsName: "",
      supplierName: "",
      orderDate: "",
      productQuantity: "",
      isOpened: false
    };
    this.toggleBox = this.toggleBox.bind(this);
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

  productsName = name => {
    console.log(
      "products: ",
      name.map(item => ({name: item.title, quantity: ''}))
    );
    this.setState({ productsName: name.map(item => ({name: item.title, quantity: ''})) });
  };

  setOrderDate = date => {
    this.setState({ orderDate: date });
  };

  setProuctQuantity(event) {
    this.setState({ productQuantity: event.target.value });
  }

  setSupplierName = event => {
    this.setState({ supplierName: event });
  };

  render() {
    const {
      productsName,
      supplierName,
      orderDate,
      productQuantity,
      isOpened
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
                  <GridItem>
                    <SelectDates
                      id={"add-order-date"}
                      label={"Choose Order Date"}
                      setDate={this.setOrderDate}
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
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productsName"}
                      items={this.state.products}
                      boxLabel={"Choose product from the list"}
                      setName={this.productsName}
                      isMultiple={true}
                    />
                  </GridItem>
                </GridContainer>
                <CardFooter>
                  <Button color="info" onClick={this.toggleBox}>
                    Manage Products Quantity
                  </Button>
                </CardFooter>
              </CardBody>
              <CardBody>
                {isOpened && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={15}>
                      <MaterialTableDemo
                        data={productsName}/>
                    </GridItem>
                  </GridContainer>
                )}

                {/* <GridContainer>
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
                </GridContainer> */}
              </CardBody>
              {isOpened && <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.hadleAddCafeteriaOrder(
                      productsName,
                      supplierName,
                      orderDate,
                      productQuantity
                    )
                  }
                >
                  Add New Order
                </Button>
              </CardFooter>}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
