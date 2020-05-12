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
import {
  handleGetCafeteriaProducts,
  handleGetCategories,
} from "../../../Handlers/Handlers";
import {
  productNameHook,
  categoryNameHook,
  productPriceHook,
  productQuantityHook,
  productMaxQuantityHook,
  productMinQuantityHook,
} from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productPrice: "",
      productQuantity: "",
      maxQuantity: "",
      minQuantity: "",
      productCategory: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaProducts()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ products: state.result });
      });
    handleGetCategories()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ categories: state.result });
      });
  };

  setProuctName(event) {
    this.setState({ productName: event.target.value });
  }

  setProuctPrice(event) {
    this.setState({ productPrice: event.target.value });
  }

  setProuctQuantity(event) {
    this.setState({ productQuantity: event.target.value });
  }

  setMaxQuantity(event) {
    this.setState({ maxQuantity: event.target.value });
  }

  setMinQuantity(event) {
    this.setState({ minQuantity: event.target.value });
  }

  setProductCategory = (name) => {
    this.setState({ productCategory: name });
  };

  render() {
    const {
      productName,
      productPrice,
      productQuantity,
      minQuantity,
      maxQuantity,
      productCategory,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Add new Product</h4>
                <p>Complete product's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productCategory"}
                      items={this.state.categories}
                      boxLabel={"Choose category"}
                      setName={this.setProductCategory}
                      isMultiple={false}
                      data-hook={categoryNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Product Name"
                      id="productName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setProuctName(event)}
                      data-hook={productNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Product Price"
                      id="productPrice"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setProuctPrice(event)}
                      data-hook={productPriceHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Product Quantity"
                      id="productQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setProuctQuantity(event)}
                      data-hook={productQuantityHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Max Quantity"
                      id="productMaxQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMaxQuantity(event)}
                      data-hook={productMaxQuantityHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Min Quantity"
                      id="productMinQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMinQuantity(event)}
                      data-hook={productMinQuantityHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleAddProduct(
                      productName,
                      productPrice,
                      productQuantity,
                      minQuantity,
                      maxQuantity,
                      productCategory
                    )
                  }
                >
                  Add New Product
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
