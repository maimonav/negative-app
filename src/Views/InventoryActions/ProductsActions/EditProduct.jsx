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
  handleGetProductDetails,
} from "../../../Handlers/Handlers";
import {
  productNameHook,
  categoryNameHook,
  productPriceHook,
  productQuantityHook,
  productMaxQuantityHook,
  productMinQuantityHook,
} from "../../../consts/data-hooks";
import {
  isAtLeastShiftManager,
  isAtLeastDeputyManager,
} from "../../../consts/permissions";
import { optional } from "../../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class EditProduct extends React.Component {
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

  setProuctName = (name) => {
    this.setState({ productName: name });
    handleGetProductDetails(name)
      .then((response) => response.json())
      .then((state) => {
        this.setState({ productDetails: state.result }, () =>
          console.log("details:", this.state.productDetails)
        );
      });
  };

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
      productDetails,
    } = this.state;
    console.log(
      "details:",
      this.state.productDetails && this.state.productDetails.productPrice
    );
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Edit Product</h4>
                <p>Complete product's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productName"}
                      items={this.state.products}
                      boxLabel={"Choose product"}
                      setName={this.setProuctName}
                      isMultiple={false}
                      data-hook={productNameHook}
                      style={{ marginBottom: "10px" }}
                    />
                  </GridItem>
                </GridContainer>
                {isAtLeastDeputyManager(this.props.permission) && (
                  <>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <ComboBox
                          id={"productCategory"}
                          items={this.state.categories}
                          boxLabel={"Choose new category"}
                          setName={this.setProductCategory}
                          isMultiple={false}
                          data-hook={categoryNameHook}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                          labelText={
                            productDetails
                              ? `Current price: ${productDetails &&
                                  productDetails.productPrice}`
                              : "Change Product Price" + optional
                          }
                          id="productPrice"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          onChange={(event) => this.setProuctPrice(event)}
                          data-hook={productPriceHook}
                        />
                      </GridItem>
                    </GridContainer>
                  </>
                )}
                {isAtLeastShiftManager(this.props.permission) && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        labelText={
                          productDetails
                            ? `Current quantity: ${productDetails &&
                                productDetails.productQuantity}`
                            : "Change Product Quantity" + optional
                        }
                        id="productQuantity"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        onChange={(event) => this.setProuctQuantity(event)}
                        data-hook={productQuantityHook}
                      />
                    </GridItem>
                  </GridContainer>
                )}
                {isAtLeastDeputyManager(this.props.permission) && (
                  <>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                          labelText={
                            productDetails
                              ? `Current Product Max Quantity: ${productDetails &&
                                  productDetails.productMaxQuantity}`
                              : "Change Product Max Quantity" + optional
                          }
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
                      <GridItem xs={12} sm={12} md={8}>
                        <CustomInput
                          labelText={
                            productDetails
                              ? `Current Product Min Quantity: ${productDetails &&
                                  productDetails.productMimQuantity}`
                              : "Change Product Min Quantity" + optional
                          }
                          id="productMinQuantity"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          onChange={(event) => this.setMinQuantity(event)}
                          data-hook={productMinQuantityHook}
                        />
                      </GridItem>
                    </GridContainer>
                  </>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleEditProduct(
                      productName,
                      productPrice,
                      productQuantity,
                      maxQuantity,
                      minQuantity,
                      productCategory
                    )
                  }
                >
                  Edit Product
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
