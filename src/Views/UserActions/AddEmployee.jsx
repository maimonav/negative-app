import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
import Button from "../../Components/CustomButtons/Button.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
const style = { justifyContent: "center", top: "auto" };
// const styles = {
//   cardCategoryWhite: {
//     color: "rgba(255,255,255,.62)",
//     margin: "0",
//     fontSize: "14px",
//     marginTop: "0",
//     marginBottom: "0"
//   },
//   cardTitleWhite: {
//     color: "#FFFFFF",
//     marginTop: "0px",
//     minHeight: "auto",
//     fontWeight: "300",
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: "3px",
//     textDecoration: "none"
//   }
// };

export default class AddEmployee extends React.Component {
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
  }

  setUsername(event) {
    this.setState({ userName: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  setFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  setLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  setPermission(event) {
    this.setState({ permission: event.target.value });
  }

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
              <CardHeader color="success">
                <h4>Add new employee</h4>
                <p>Complete his profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setUsername(event)}
                    />
                  </GridItem>
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
                      labelText="Permission - type: User, Shift Manager, Deputy Directo, Director"
                      id="permission"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setPermission(event)}
                    />
                  </GridItem>
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
                  color="success"
                  onClick={() =>
                    this.props.handleAddEmployee(
                      userName,
                      password,
                      firstName,
                      lastName,
                      permission,
                      contactDetails
                    )
                  }
                >
                  Add New Employee
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
