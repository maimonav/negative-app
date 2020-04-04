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
import { handleGetMovies, handleGetCategories } from "../../../Handlers/Handlers";
import {
  movieNameHook,
  categoryNameHook,
  keyHook,
  examinationRoomHook
} from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class EditMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
      category: "",
      key: "",
      examinationRoom: ""
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
    this.setState({ movieName: movieName });
  };

  setCategory = category => {
    this.setState({ category: category });
  };

  setKey = event => {
    this.setState({ key: event.target.value });
  };

  setExaminationRoom = event => {
    this.setState({ examinationRoom: event.target.value });
  };

  render() {
    const { movieName, category, key, examinationRoom } = this.state;
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
                      items={this.state.movies}
                      boxLabel={"Choose movie"}
                      setName={this.setMovieName}
                      isMultiple={false}
                      data-hook={movieNameHook}
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
                      data-hook={categoryNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Key"
                      id="key"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setKey(event)}
                      data-hook={keyHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Examination room"
                      id="examinationRoom"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setExaminationRoom(event)}
                      data-hook={examinationRoomHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleEditMovie(
                      movieName,
                      category,
                      key,
                      examinationRoom
                    )
                  }
                >
                  Edit Movie
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}