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
const style = { justifyContent: "center", top: "auto" };

export default class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: ""
    };
  }

  setCategoryName(event) {
    this.setState({ categoryName: event.target.value });
  }

  render() {
    const { categoryName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Add new Category</h4>
                <p>Complete Category's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Category Name"
                      id="categoryName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setCa(event)}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" onClick={() => "Clicked"}>
                  Add New Category
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
