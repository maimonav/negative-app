import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import {
  AddSupplier,
  EditSupplier,
  RemoveSupplier,
  ShowSupplier
} from "../index";
import {
  handleAddSupplier,
  handleEditSupplier,
  handleRemoveSupplier
} from "../../Handlers/Handlers";
import {
  showActionHook,
  addActionHook,
  editActionHook,
  removeActionHook
} from "../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ManageSuppliers extends React.Component {
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
            <Card style={style}>
              <CardHeader color="info">
                <h4>Manage Suppliers</h4>
              </CardHeader>
              <CardBody>
                <GridContainer style={style}>
                  <Tooltip title="Show" aria-label="show">
                    <Fab
                      color="inherit"
                      size="small"
                      onClick={() => this.onChange("show")}
                      data-hook={showActionHook}
                    >
                      <ShowIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Add" aria-label="add">
                    <Fab
                      color="inherit"
                      size="small"
                      onClick={() => this.onChange("add")}
                      data-hook={addActionHook}
                    >
                      <AddIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Edit" aria-label="edit">
                    <Fab
                      color="inherit"
                      size="small"
                      onClick={() => this.onChange("edit")}
                      data-hook={editActionHook}
                    >
                      <EditIcon />
                    </Fab>
                  </Tooltip>

                  <Tooltip title="Delete" aria-label="delete">
                    <Fab
                      color="inherit"
                      size="small"
                      onClick={() => this.onChange("delete")}
                      data-hook={removeActionHook}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Tooltip>
                </GridContainer>
              </CardBody>
              {this.state.action === "show" && <ShowSupplier></ShowSupplier>}
              {this.state.action === "add" && (
                <AddSupplier
                  handleAddSupplier={handleAddSupplier}
                ></AddSupplier>
              )}
              {this.state.action === "edit" && (
                <EditSupplier
                  handleEditSupplier={handleEditSupplier}
                ></EditSupplier>
              )}
              {this.state.action === "delete" && (
                <RemoveSupplier
                  handleRemoveSupplier={handleRemoveSupplier}
                ></RemoveSupplier>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
