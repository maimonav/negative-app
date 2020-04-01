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
    handleGetCafeteriaOrders,
    handleGetOrderDetails
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ShowCafeteriaOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaOrders(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ orders: state.result });
      });
  };

  setOrderId = orderId => {
    this.setState({ orderId });
    handleGetOrderDetails(orderId, localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
          this.setState({ orderId: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Show order details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"orderId"}
                    items={this.state.orders}
                    boxLabel={"Choose order"}
                    setName={this.setOrderId}
                    isMultiple={false}
                  />
                </GridItem>
                {this.state.orderId && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="field1"
                        defaultValue=""
                        label="orderId"
                        value={this.state.orderId.orderId || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="field2"
                        defaultValue=""
                        label="Order Date"
                        value={this.state.orderId.orderDate || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="field3"
                        defaultValue=""
                        label="supplier Details"
                        value={this.state.orderId.supplierDetails || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="field4"
                        defaultValue=""
                        label="products"
                        value={this.state.orderId.products || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="field5"
                        defaultValue=""
                        label="product Quantity"
                        value={this.state.orderId.productQuantity || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
