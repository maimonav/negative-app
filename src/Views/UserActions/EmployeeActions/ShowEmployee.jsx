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
  handleGetEmployees,
  handleGetEmployeeDetails
} from "../../../Handlers/Handlers";
import { userNameHook, contactDetailsHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

const marginStyle = { marginBottom: "10px", marginRight: "10px" };

export default class ShowEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetEmployees(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ employees: state.result });
      });
  };

  setUsername = userName => {
    this.setState({ userName });
    handleGetEmployeeDetails(userName, localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ employee: state.result });
      });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Show employee details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"userName"}
                    items={this.state.employees}
                    boxLabel={"Choose employee"}
                    setName={this.setUsername}
                    isMultiple={false}
                    data-hook={userNameHook}
                    style={marginStyle}
                  />
                </GridItem>
                {this.state.userName && this.state.employee && (
                  <GridItem xs={12} sm={12} md={8}>
                    <TextField
                      id="filled-read-only-input"
                      defaultValue=""
                      label="First name"
                      value={this.state.employee.firstName || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      style={marginStyle}
                      variant="outlined"
                    />
                    <TextField
                      id="filled-read-only-input"
                      defaultValue=""
                      label="Last name"
                      value={this.state.employee.lastName || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      style={marginStyle}
                      variant="outlined"
                    />

                    <TextField
                      id="filled-read-only-input"
                      defaultValue=""
                      label="Permissions"
                      value={this.state.employee.permissions || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      style={marginStyle}
                      variant="outlined"
                    />
                    <TextField
                      id="filled-read-only-input"
                      defaultValue=""
                      label="Contact details"
                      value={this.state.employee.contactDetails || ""}
                      InputProps={{
                        readOnly: true
                      }}
                      style={marginStyle}
                      variant="outlined"
                      data-hook={contactDetailsHook}
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
