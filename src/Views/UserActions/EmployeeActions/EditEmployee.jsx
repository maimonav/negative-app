import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import {
  handleGetEmployees,
  handleGetEmployeeDetails,
} from "../../../Handlers/Handlers";
import { permissions } from "../../../consts/permissions";
import {
  permissionsHook,
  userNameHook,
  passwordHook,
  firstNameHook,
  lastNameHook,
  contactDetailsHook,
} from "../../../consts/data-hooks";
import { optional } from "../../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class EditEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      permission: "",
      contactDetails: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetEmployees(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ employees: state.result });
      });
  };

  setUsername = (userName) => {
    this.setState({ userName });
    handleGetEmployeeDetails(userName, localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ employeeDetails: state.result });
      });
  };

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  setFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  setPermission = (permission) => {
    this.setState({ permission });
  };

  setContactDetails(event) {
    this.setState({ contactDetails: event.target.value });
  }

  render() {
    const {
      userName,
      password,
      firstName,
      lastName,
      permission,
      contactDetails,
      employeeDetails,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Edit employee</h4>
                <p>Change the details you want about the employee you choose</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"userName"}
                      items={this.state.employees}
                      boxLabel={"Choose employee"}
                      setName={this.setUsername}
                      isMultiple={false}
                      data-hook={userNameHook}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id="permission"
                      items={permissions}
                      boxLabel={
                        employeeDetails
                          ? `Current Permission: ${
                              employeeDetails && employeeDetails.permissions
                                ? employeeDetails.permissions
                                : "none"
                            }`
                          : "Employee Permission" + optional
                      }
                      setName={this.setPermission}
                      isMultiple={false}
                      data-hook={permissionsHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setPassword(event)}
                      autoComplete="new-password"
                      data-hook={passwordHook}
                      type="password"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={
                        employeeDetails
                          ? `Current First Name: ${
                              employeeDetails && employeeDetails.firstName
                                ? employeeDetails.firstName
                                : "none"
                            }`
                          : "Change Employee First Name" + optional
                      }
                      id="first-name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setFirstName(event)}
                      data-hook={firstNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={
                        employeeDetails
                          ? `Current Last Name: ${
                              employeeDetails && employeeDetails.lastName
                                ? employeeDetails.lastName
                                : "none"
                            }`
                          : "Change Employee Last Name" + optional
                      }
                      id="last-name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setLastName(event)}
                      data-hook={lastNameHook}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={
                        employeeDetails
                          ? `Current Contact Details: ${
                              employeeDetails && employeeDetails.contactDetails
                                ? employeeDetails.contactDetails
                                : "none"
                            }`
                          : "Change Employee Contact" + optional
                      }
                      id="contactDetails"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setContactDetails(event)}
                      data-hook={contactDetailsHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() =>
                    this.state.userName
                      ? this.props.handleEditEmployee(
                          userName,
                          password,
                          firstName,
                          lastName,
                          permission,
                          contactDetails
                        )
                      : alert("Employee name is required.")
                  }
                >
                  Edit Employee
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
