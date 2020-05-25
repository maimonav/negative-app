import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Card from "../../../Components/Card/Card.js";
import TextField from "@material-ui/core/TextField";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import ComboBox from "../../../Components/AutoComplete";
import {
  handleGetCafeteriaProducts,
  handleGetProductDetails,
} from "../../../Handlers/Handlers";
import { productNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ShowProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaProducts()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ products: state.result });
      });
  };

  setProductName = (productName) => {
    this.setState({ productName });
    handleGetProductDetails(productName)
      .then((response) => response.json())
      .then((state) => {
        this.setState({ productName: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card style={{ backgroundColor: "#FFFFF0" }}>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show product details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"productName"}
                    items={this.state.products}
                    boxLabel={"Choose product"}
                    setName={this.setProductName}
                    isMultiple={false}
                    data-hook={productNameHook}
                  />
                </GridItem>
                {this.state.productName && (
                  <GridItem xs={12} sm={12} md={8}>
                    <TextField
                      id="field1"
                      defaultValue=""
                      label="productName"
                      value={this.state.productName.productName || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field2"
                      defaultValue=""
                      label="Product Category"
                      value={this.state.productName.productCategory || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field3"
                      defaultValue=""
                      label="Product Price"
                      value={this.state.productName.productPrice || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field4"
                      defaultValue=""
                      label="Product Quantity"
                      value={this.state.productName.productQuantity || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field5"
                      defaultValue=""
                      label="Product Max Qunatity"
                      value={this.state.productName.productMaxQunatity || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field6"
                      defaultValue=""
                      label="Product Mim Qunatity"
                      value={this.state.productName.productMimQunatity || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="filled"
                    />
                  </GridItem>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
