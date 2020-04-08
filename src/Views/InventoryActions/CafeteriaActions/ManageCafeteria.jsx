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
  ShowCafeteriaOrder,
  AddCafeteriaOrder,
  EditCafeteriaOrder,
  RemoveCafeteriaOrder
} from "../../index";
import {
  handleAddCafeteriaOrder,
  handleEditCafeteriaOrder,
  handleRemoveCafeteriaOrder
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };
const iconStyle = {
  marginTop: "-10px",
  boxShadow: "none",
  backgroundColor: "unset",
  color: "white"
};

export default class ManageCafeteria extends React.Component {
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
                    <h4 style={{ margin: "auto" }}>Manage Cafeteria</h4>
                  </GridItem>
                  <Tooltip title="Show" aria-label="show">
                    <Fab
                      color="default"
                      size="small"
                      onClick={() => this.onChange("show")}
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
                      style={iconStyle}
                    >
                      <DeleteIcon />
                    </Fab>
                  </Tooltip>
                </GridContainer>
              </CardHeader>
              {this.state.action === "show" && <ShowCafeteriaOrder />}
              {this.state.action === "add" && (
                <AddCafeteriaOrder
                  hadleAddCafeteriaOrder={handleAddCafeteriaOrder}
                />
              )}
              {this.state.action === "edit" && (
                <EditCafeteriaOrder
                  handleEditCafeteriaOrder={handleEditCafeteriaOrder}
                />
              )}
              {this.state.action === "delete" && (
                <RemoveCafeteriaOrder
                  handleRemoveCafeteriaOrder={handleRemoveCafeteriaOrder}
                />
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
