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
  AddEmployee,
  EditEmployee,
  RemoveEmployee,
  ShowEmployee
} from "../index";
import {
  handleAddEmployee,
  handleEditEmployee,
  handleRemoveEmployee
} from "../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class ManageEmployees extends React.Component {
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
                <h4>Manage Employees</h4>
              </CardHeader>
              <CardBody>
                <GridContainer style={style}>
                  <Tooltip title="Show" aria-label="show">
                    <Fab color="inherit" onClick={() => this.onChange("show")}>
                      <ShowIcon />
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
              {this.state.action === "show" && <ShowEmployee></ShowEmployee>}
              {this.state.action === "add" && (
                <AddEmployee
                  handleAddEmployee={handleAddEmployee}
                ></AddEmployee>
              )}
              {this.state.action === "edit" && (
                <EditEmployee
                  handleEditEmployee={handleEditEmployee}
                ></EditEmployee>
              )}
              {this.state.action === "delete" && (
                <RemoveEmployee
                  handleRemoveEmployee={handleRemoveEmployee}
                ></RemoveEmployee>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
