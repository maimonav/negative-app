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
import {
  categoryNameHook,
  categoryParentNameHook
} from "../../../consts/data-hooks";
import { handleGetCategories } from "../../../Handlers/Handlers";
import { optional } from "../../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
      parentName: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCategories()
      .then(response => response.json())
      .then(state => {
        this.setState({ categories: state.result });
      });
  };

  setCategoryName(event) {
    this.setState({ categoryName: event.target.value });
  }

  setCategoryParentName = name => {
    this.setState({ parentName: name });
  };

  render() {
    const { categoryName, parentName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Add new Category</h4>
                <p>Complete Category's details</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <CustomInput
                      labelText="Category Name"
                      id="categoryName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "string"
                      }}
                      onChange={event => this.setCategoryName(event)}
                      data-hook={categoryNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <h3
                      style={{
                        margin: "auto",
                        marginTop: "20px",
                        marginBottom: "10px"
                      }}
                    >
                      Choose category parent - meaning the new category will be
                      his sub-category:{" "}
                    </h3>
                    <ComboBox
                      id={"categoryParentName"}
                      items={this.state.categories}
                      boxLabel={"Choose category parent" + optional}
                      setName={this.setCategoryParentName}
                      isMultiple={false}
                      data-hook={categoryParentNameHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleAddCategory(categoryName, parentName)
                  }
                >
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
