import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import { handleGetCategories } from "../../../Handlers/Handlers";
import { categoryNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCategories()
      .then((response) => response.json())
      .then((state) => {
        this.setState({ categories: state.result });
      });
  };

  setCategoryName = (name) => {
    this.setState({ categoryName: name });
  };

  render() {
    const { categoryName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Remove Category</h4>
                <p>Complete category's name</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"categoryName"}
                      items={this.state.categories}
                      boxLabel={"Choose category"}
                      setName={this.setCategoryName}
                      isMultiple={false}
                      data-hook={categoryNameHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() =>
                    this.props
                      .handleRemoveCategory(categoryName)
                      .then((response) => response.json())
                      .then((state) => {
                        alert(state.result);
                        this.setInitialState();
                      })
                  }
                >
                  Remove Category
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
