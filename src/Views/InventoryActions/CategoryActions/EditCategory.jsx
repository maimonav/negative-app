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
import { handleGetCategories } from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class EditCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
      parentName: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCategories(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ categories: state.result });
      });
  };

  setCategoryName = name => {
    this.setState({ categoryName: name });
  };

  setCategoryParentName(event) {
    this.setState({ parentName: event.target.value });
  }

  render() {
    const { categoryName, parentName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Edit Category</h4>
                <p>Complete Category's details</p>
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
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Category Parent Name"
                      id="categoryParentName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setCategoryParentName(event)}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleEditCategory(categoryName, parentName)
                  }
                >
                  Edit Category
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
