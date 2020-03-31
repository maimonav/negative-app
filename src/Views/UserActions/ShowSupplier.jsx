import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import TextField from "@material-ui/core/TextField";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import ComboBox from "../../Components/AutoComplete";
import {
  handleGetSuppliers,
  handleGetSupplierDetails
} from "../../Handlers/Handlers";
import { userNameHook, contactDetailsHook } from "../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ShowSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetSuppliers(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ suppliers: state.result });
      });
  };

  setSupplierName = supplierName => {
    this.setState({ supplierName });
    handleGetSupplierDetails(supplierName, localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ contactDetails: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Show Supplier details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"userName"}
                    items={this.state.suppliers}
                    boxLabel={"Choose Supplier"}
                    setName={this.setSupplierName}
                    isMultiple={false}
                    data-hook={userNameHook}
                  />
                </GridItem>
                {this.state.supplierName && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="Contact details"
                        value={this.state.contactDetails || ""}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                        data-hook={contactDetailsHook}
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
