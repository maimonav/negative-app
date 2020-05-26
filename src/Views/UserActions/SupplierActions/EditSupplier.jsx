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
import { handleGetSuppliers } from "../../../Handlers/Handlers";
import { userNameHook, contactDetailsHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class EditSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: "",
      contactDetails: ""
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
  };

  setContactDetails(event) {
    this.setState({ contactDetails: event.target.value });
  }

  render() {
    const { supplierName, contactDetails } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Edit supplier</h4>
                <p>Complete his profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer style={style}>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplierName"}
                      items={this.state.suppliers}
                      boxLabel={"Choose supplier"}
                      setName={this.setSupplierName}
                      isMultiple={false}
                      data-hook={userNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Contact details"
                      id="contactDetails"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setContactDetails(event)}
                      data-hook={contactDetailsHook}
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
                      ? this.props.handleEditSupplier(
                          supplierName,
                          contactDetails
                        )
                      : alert("All fields are required.")
                  }
                >
                  Edit Supplier
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
