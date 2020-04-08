import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import { handleGetEmployees } from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveEmployee extends React.Component {
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
  };

  render() {
    const { userName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Remove employee</h4>
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
                </GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() => this.props.handleRemoveEmployee(userName)}
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
