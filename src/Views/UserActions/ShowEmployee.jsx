import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import TextField from "@material-ui/core/TextField";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import ComboBox from "../../Components/AutoComplete";
import { exampleNames, exampleEmployeesDetails } from "../../consts/data";
const style = { justifyContent: "center", top: "auto" };

export default class ShowEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: ""
    };
  }

  setUsername = userName => {
    this.setState({ userName });
    const details = exampleEmployeesDetails.get(userName);

    if (details) {
      this.setState({
        password: details.password || "",
        firstName: details.firstName || "",
        lastName: details.lastName || "",
        permissions: details.permissions || "",
        contactDetails: details.contactDetails || ""
      });
      console.log(details);
    } else {
      this.setState({
        password: "",
        firstName: "",
        lastName: "",
        permissions: "",
        contactDetails: ""
      });
    }
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success">
                <h4>Show employee details</h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={6}>
                  <ComboBox
                    id={"userName"}
                    items={exampleNames}
                    boxLabel={"Choose employee"}
                    setName={this.setUsername}
                  />
                </GridItem>
                {this.state.userName && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="Password"
                        value={this.state.password}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="First name"
                        value={this.state.firstName}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="Last name"
                        value={this.state.lastName}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="Permissions"
                        value={this.state.permissions}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                      <TextField
                        id="filled-read-only-input"
                        defaultValue=""
                        label="Contact detals"
                        value={this.state.contactDetails}
                        InputProps={{
                          readOnly: true
                        }}
                        variant="filled"
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
