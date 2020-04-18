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
    handleGetCafeteriaProducts(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ products: state.result });
      });
    handleGetCategories(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ categories: state.result });
      });
  };

  setProuctName = (name) => {
    this.setState({ productName: name });
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
    } = this.state;
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
                      boxLabel={"Choose product from the list"}
                      setName={this.setProuctName}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productCategory"}
                      items={this.state.categories}
                      boxLabel={"Choose new category if you want"}
                      setName={this.setProductCategory}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Change Product Price"
                      id="productPrice"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setProuctPrice(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Change Product Quantity"
                      id="productQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setProuctQuantity(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Change Product Max Quantity"
                      id="productMaxQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMaxQuantity(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Change Product Min Quantity"
                      id="productMinQuantity"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMinQuantity(event)}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleEditProduct(
                      productName,
                      productPrice,
                      productQuantity,
                      minQuantity,
                      maxQuantity,
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
