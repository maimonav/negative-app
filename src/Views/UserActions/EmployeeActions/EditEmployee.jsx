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
import { handleGetEmployees } from "../../../Handlers/Handlers";
import { permissions } from "../../../consts/data";
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
      contactDetails: ""
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

  setPermission = permission => {
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
      contactDetails
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
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
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id="permission"
                      items={permissions}
                      boxLabel={"Choose permission"}
                      setName={this.setPermission}
                      isMultiple={false}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setPassword(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setFirstName(event)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setLastName(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Contact Details"
                      id="contactDetails"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setContactDetails(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleEditEmployee(
                      userName,
                      password,
                      firstName,
                      lastName,
                      permission,
                      contactDetails
                    )
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
