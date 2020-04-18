import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Card from "../../../Components/Card/Card.js";
import TextField from "@material-ui/core/TextField";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import ComboBox from "../../../Components/AutoComplete";
import {
  handleGetCategories,
  handleGetCategoryDetails,
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ShowCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCategories(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ categories: state.result });
      });
  };

  setCategoryName = (categoryName) => {
    this.setState({ categoryName });
    handleGetCategoryDetails(categoryName, localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ categoryName: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show category details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"categoryName"}
                    items={this.state.categories}
                    boxLabel={"Choose category"}
                    setName={this.setCategoryName}
                    isMultiple={false}
                  />
                </GridItem>
                {this.state.categoryName && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="field1"
                        defaultValue=""
                        label="categoryName"
                        value={this.state.categoryName.categoryName || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="field2"
                        defaultValue=""
                        label="Category Parent"
                        value={this.state.categoryName.categoryParent || ""}
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
