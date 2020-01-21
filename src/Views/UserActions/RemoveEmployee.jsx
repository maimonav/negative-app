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

export default class RemoveEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      password: "",
    };
  }

  setUserId(event) {
    this.setState({ userId: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const {
      userId,
      password,
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success">
                <h4>Remove employee</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="User Id"
                      id="userId"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setUserId(event)}
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
                  
                  
                </GridContainer>
                <GridContainer>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter>
                <Button
                  color="success"
                  onClick={() =>
                    this.props.handleRemoveEmployee(
                      userId,
                      password,
                    )
                  }
                >
                  Remove Employee
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
