import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import { CreateMovieOrder, AddMovie, EditMovie, RemoveMovie } from "../index";
import {
  handleAddMovie,
  handleEditMovie,
  handleRemoveMovie
} from "../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ManageMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = { action: "show" };
  }

  onChange = action => {
    this.setState({ action });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4>Manage Movies</h4>
              </CardHeader>
              <CardBody>
                <GridContainer style={style}>
                  <Tooltip title="Create" aria-label="create">
                    <Fab
                      color="inherit"
                      onClick={() => this.onChange("create")}
                    >
                      <NoteAddIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Add" aria-label="add">
                    <Fab color="inherit" onClick={() => this.onChange("add")}>
                      <AddIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Edit" aria-label="edit">
                    <Fab color="inherit" onClick={() => this.onChange("edit")}>
                      <EditIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Delete" aria-label="delete">
                    <Fab
                      color="inherit"
                      onClick={() => this.onChange("delete")}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Tooltip>
                </GridContainer>
              </CardBody>
              {this.state.action === "create" && <CreateMovieOrder />}
              {this.state.action === "add" && (
                <AddMovie handleAddMovie={handleAddMovie} />
              )}
              {this.state.action === "edit" && (
                <EditMovie handleEditMovie={handleEditMovie} />
              )}
              {this.state.action === "delete" && (
                <RemoveMovie handleRemoveMovie={handleRemoveMovie} />
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
