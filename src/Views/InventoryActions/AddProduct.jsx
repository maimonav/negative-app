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

// const styles = {
//   cardCategoryWhite: {
//     color: "rgba(255,255,255,.62)",
//     margin: "0",
//     fontSize: "14px",
//     marginTop: "0",
//     marginBottom: "0"
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none"
//   }
// };

export default class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productPrice: "",
      productQuantity: "",
      maxQuantity: "",
      minQuantity: "",
      productCategory: ""
    };
  }

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

  setProductCategory(event) {
    this.setState({ productCategory: event.target.value });
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Add new Product</h4>
                <p>Complete product's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Product Name"
                      id="productName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setProuctName(event)}
                    />
                  </GridItem>
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
                      id="productPrice"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setProuctQuantity(event)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Max Quantity"
                      id="productMaxQuantity"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setMaxQuantity(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Min Quantity"
                      id="productMinQuantity"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.minQuantity(event)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Set Product Category"
                      id="productCategory"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setProductCategory(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" onClick={() => "hello"}>
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
