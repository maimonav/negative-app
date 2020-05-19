import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Card from "../../../Components/Card/Card.js";
import TextField from "@material-ui/core/TextField";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import ComboBox from "../../../Components/AutoComplete";
import moment from "moment";
import {
  handleGetMovieOrders,
  handleGetMovieOrderDetails,
} from "../../../Handlers/Handlers";
import { orderNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ShowMovieOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovieOrders()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ orders: state.result });
      });
  };

  setOrderId = (orderId) => {
    this.setState({ orderId });
    handleGetMovieOrderDetails(orderId)
      .then((response) => response.json())
      .then((state) => {
        this.setState({ orderId: state.result });
      });
  };

  columns = [{ title: "Product Name", field: "name" }];

  render() {
    const { orderId } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show order details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"orderId"}
                    items={this.state.orders}
                    boxLabel={"Choose order"}
                    setName={this.setOrderId}
                    isMultiple={false}
                    data-hook={orderNameHook}
                  />
                </GridItem>
                {this.state.orderId && (
                  <GridContainer style={style}>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="field1"
                        defaultValue=""
                        label="Order Date"
                        value={
                          moment(orderId.orderDate).format("DD/MM/YYYY") || ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="filled"
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="field2"
                        defaultValue=""
                        label="supplier Details"
                        value={orderId.supplierDetails || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="filled"
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="field3"
                        defaultValue=""
                        label="Movies:"
                        value={orderId.products || ""}
                        InputProps={{
                          readOnly: true,
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
