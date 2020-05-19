import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import ShowReport from "./ShowReport";
import AddField from "./AddField";
import RemoveField from "./RemoveField";

import {
  showActionHook,
  addActionHook,
  removeActionHook
} from "../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };
const iconStyle = {
  marginTop: "-10px",
  boxShadow: "none",
  backgroundColor: "unset",
  color: "white"
};

export default class ManageReports extends React.Component {
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
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <h4 style={{ margin: "auto" }}>Manage Reports</h4>
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
                  <Tooltip title="Add field" aria-label="add">
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
                  <Tooltip title="Delete field" aria-label="delete">
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
              {this.state.action === "show" && <ShowReport></ShowReport>}
              {this.state.action === "add" && <AddField></AddField>}
              {this.state.action === "delete" && <RemoveField></RemoveField>}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
