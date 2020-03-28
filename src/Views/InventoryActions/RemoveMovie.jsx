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

export default class EditMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: ""
    };
  }

  setMovieName = movieName => {
    this.setState({ movieName: movieName });
  };

  exampleNames = [
    { title: "movie" },
    { title: "Van Henry" },
    { title: "April Tucker" },
    { title: "Ralph Hubbard" }
  ];

  render() {
    const { movieName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Edit movie</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"movieName"}
                      items={exampleNames}
                      boxLabel={"Choose movie"}
                      setName={this.setMovieName}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() => this.props.handleRemoveMovie(movieName)}
                >
                  Remove Movie
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}