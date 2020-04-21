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
  handleGetMovies,
  handleGetMovieDetails
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ShowMovieDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ movies: state.result });
      });
  };

  setMovieName = movieName => {
    this.setState({ movieName });
    handleGetMovieDetails(movieName, localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ movieName: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show movie details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"movieName"}
                    items={this.state.movies}
                    boxLabel={"Choose movie"}
                    setName={this.setMovieName}
                    isMultiple={false}
                  />
                </GridItem>
                {this.state.movieName && (
                  <GridItem xs={12} sm={12} md={8}>
                    <TextField
                      id="field1"
                      defaultValue=""
                      label="movieName"
                      value={this.state.movieName.movieName || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field2"
                      defaultValue=""
                      label="Movie Key"
                      value={this.state.movieName.movieKey || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field3"
                      defaultValue=""
                      label="Examination Room"
                      value={this.state.movieName.examinationRoom || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      variant="filled"
                    />
                    <TextField
                      id="field4"
                      defaultValue=""
                      label="category"
                      value={this.state.movieName.category || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      variant="filled"
                    />
                  </GridItem>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
