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

export default class CreateMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
      supplier: "",
      cntactDetails: ""
    };
  }

  setMovieName = movieName => {
    this.setState({ movieName: movieName });
  };

  setCategory = supplier => {
    this.setState({ supplier: supplier });
  };

  setcntactDetails = cntactDetails => {
    this.setState({ cntactDetails: cntactDetails });
  };

  render() {
    const { movieName, supplier } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Create New Movie Order</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"movieName"}
                      items={exampleNames}
                      boxLabel={"Choose movie"}
                      setName={this.setMovieName}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplier"}
                      items={exampleNames}
                      boxLabel={"Choose supplier"}
                      setName={this.setCategory}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() => this.props.handleAddMovie(movieName, supplier)}
                >
                  Create New Order
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
