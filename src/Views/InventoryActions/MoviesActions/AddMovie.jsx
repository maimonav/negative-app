import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import ComboBox from "../../../Components/AutoComplete";
import { handleGetCategories } from "../../../Handlers/Handlers";
import { movieNameHook, categoryNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class AddMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
      category: "",
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

  setMovieName(event) {
    this.setState({ movieName: event.target.value });
  }

  setCategory = (name) => {
    this.setState({ category: name });
  };

  render() {
    const { movieName, category } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Add New movie</h4>
              </CardHeader>
              <CardBody>
                <GridContainer style={{ paddingLeft: "5px" }}>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Add Movie Name"
                      id="movieName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMovieName(event)}
                      data-hook={movieNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <div
                  style={{
                    margin: "auto",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <ComboBox
                        id={"category"}
                        items={this.state.categories}
                        boxLabel={"Choose category"}
                        setName={this.setCategory}
                        isMultiple={false}
                        data-hook={categoryNameHook}
                      />
                    </GridItem>
                  </GridContainer>
                </div>
              </CardBody>
              <CardFooter style={{ paddingLeft: "15px" }}>
                <Button
                  color="info"
                  onClick={() => this.props.handleAddMovie(movieName, category)}
                >
                  Add Movie
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
