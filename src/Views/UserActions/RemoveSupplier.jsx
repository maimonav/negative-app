import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Button from "../../Components/CustomButtons/Button.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import ComboBox from "../../Components/AutoComplete";
import { exampleNames } from "../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: "",
      contactDetails: ""
    };
  }

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
              <CardHeader color="success">
                <h4>Remove supplier</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplierName"}
                      items={exampleNames}
                      boxLabel={"Choose supplier"}
                      setName={this.setSupplierName}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="success"
                  onClick={() =>
                    this.props.handleRemoveSupplier(
                      supplierName,
                      contactDetails
                    )
                  }
                >
                  Remove Supplier
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
