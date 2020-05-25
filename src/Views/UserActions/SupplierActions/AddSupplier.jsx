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
import { userNameHook, contactDetailsHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class AddSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: "",
      contactDetails: "",
    };
  }

  setSupplierName(event) {
    this.setState({ supplierName: event.target.value });
  }

  setContactDetails(event) {
    this.setState({ contactDetails: event.target.value });
  }

  render() {
    const { supplierName, contactDetails } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card style={{ backgroundColor: "#FFFFF0" }}>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Add new supplier</h4>
                <p>Complete his profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Name"
                      id="supplierName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      data-hook={userNameHook}
                      onChange={(event) => this.setSupplierName(event)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Contact details"
                      id="contactDetails"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      data-hook={contactDetailsHook}
                      onChange={(event) => this.setContactDetails(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() =>
                    this.state.supplierName && this.state.contactDetails
                      ? this.props.handleAddSupplier(
                          supplierName,
                          contactDetails
                        )
                      : alert("All fields are required.")
                  }
                >
                  Add New Supplier
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
