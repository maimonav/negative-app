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
  handleGetMovieDetails,
} from "../../../Handlers/Handlers";
import { movieNameHook, categoryNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };
const marginStyle = { marginBottom: "10px", marginRight: "10px" };

export default class ShowMovieDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ movies: state.result });
      });
  };

  setMovieName = (movieName) => {
    this.setState({ movieName });
    handleGetMovieDetails(movieName)
      .then((response) => response.json())
      .then((state) => {
        this.setState({ movieName: state.result });
      });
  };

  columns = [
    { title: "Movie Name", field: "name" },
    { title: "Key", field: "expectedQuantity" },
    { title: "Examination room", field: "actualQuantity" },
  ];

  render() {
    const { movieName } = this.state;
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
                    data-hook={movieNameHook}
                    style={marginStyle}
                  />
                </GridItem>
                {movieName && (
                  <GridItem xs={12} sm={12} md={8}>
                    <TextField
                      id="field1"
                      defaultValue=""
                      label="Movie Name"
                      value={movieName.movieName || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      style={marginStyle}
                      variant="outlined"
                    />
                    <TextField
                      id="field2"
                      defaultValue=""
                      label="Category"
                      value={movieName.category || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                      style={marginStyle}
                      variant="outlined"
                      data-hook={categoryNameHook}
                    />
                    <TextField
                      id="field3"
                      defaultValue=""
                      label="Movie Key"
                      value={movieName.movieKey || "none"}
                      InputProps={{
                        readOnly: true,
                      }}
                      style={marginStyle}
                      variant="outlined"
                    />
                    <TextField
                      id="field4"
                      defaultValue=""
                      label="Examination Room"
                      value={movieName.examinationRoom || "none"}
                      InputProps={{
                        readOnly: true,
                      }}
                      style={marginStyle}
                      variant="outlined"
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
