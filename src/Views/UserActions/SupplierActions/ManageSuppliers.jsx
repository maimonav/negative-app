import React from "react";
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import {
  AddSupplier,
  EditSupplier,
  RemoveSupplier,
  ShowSupplier
} from "../../index";
import {
  handleAddSupplier,
  handleEditSupplier,
  handleRemoveSupplier
} from "../../../Handlers/Handlers";
import {
  showActionHook,
  addActionHook,
  editActionHook,
  removeActionHook
} from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };
const iconStyle = { marginTop: "-10px" };

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
          <GridItem xs={12} sm={12} md={6}>
            <Card style={style}>
              <CardHeader color="info">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <h4 style={{ margin: "auto" }}>Manage Suppliers</h4>
                  </GridItem>
                  <Tooltip title="Show" aria-label="show">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("show")}
                      data-hook={showActionHook}
                      style={iconStyle}
                    >
                      <ShowIcon />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Add" aria-label="add">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("add")}
                      data-hook={addActionHook}
                      style={iconStyle}
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
                      style={iconStyle}
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
                      style={iconStyle}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Tooltip>
                </GridContainer>
              </CardHeader>
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
