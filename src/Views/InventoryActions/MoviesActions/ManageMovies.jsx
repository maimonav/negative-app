import React from "react";
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import { CreateMovieOrder, AddMovie, EditMovie, RemoveMovie, ShowMovieDetails } from "../../index";
import {
  handleAddMovie,
  handleEditMovie,
  handleRemoveMovie
} from "../../../Handlers/Handlers";
import { editActionHook, removeActionHook } from "../../../consts/data-hooks";
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
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <h4>Manage Movies</h4>
                  </GridItem>
                  <Tooltip title="Show" aria-label="show">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("show")}
                    >
                      <ShowIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Create" aria-label="create">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("create")}
                    >
                      <NoteAddIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Add" aria-label="add">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("add")}
                    >
                      <AddIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Edit" aria-label="edit">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("edit")}
                      data-hook={editActionHook}
                    >
                      <EditIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Delete" aria-label="delete">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("delete")}
                      data-hook={removeActionHook}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Tooltip>
                </GridContainer>
              </CardHeader>
              {this.state.action === "show" && <ShowMovieDetails />}
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
