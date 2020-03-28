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
import { handleGetMovies, handleGetCategories } from "../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class AddMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
      category: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ movies: state.result });
      });

    handleGetCategories(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ categories: state.result });
      });
  };

  setMovieName = movieName => {
    this.setState({ movieName });
  };

  setCategory = category => {
    this.setState({ category });
  };

  render() {
    const { movieName, category } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Add New movie</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"movieName"}
                      items={this.state.movies}
                      boxLabel={"Choose movie"}
                      setName={this.setMovieName}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"category"}
                      items={this.state.categories}
                      boxLabel={"Choose category"}
                      setName={this.setCategory}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
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
