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

export default class RemoveProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: ""
    };
  }

  setProuctName = name => {
    this.setState({ productName: name });
  };

  render() {
    const { productName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Remvoe Product</h4>
                <p>Complete product's name</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"productName"}
                      items={exampleNames}
                      boxLabel={"Choose product from the list"}
                      setName={this.setProuctName}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() => this.props.handleRemoveProduct(productName)}
                >
                  Remove Product
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
