import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
// import ComboBox from "../../Components/AutoComplete";
import { HandleAddFieldToGeneralDailyReport } from "../../Handlers/Handlers";
import Button from "../../Components/CustomButtons/Button.js";
const style = { justifyContent: "center", top: "auto" };

export default class AddField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setField(event) {
    this.setState({ field: event.target.value });
  }

  render() {
    const { field } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>
                  Add new field to General Daily report
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="New field"
                      id="newField"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setField(event)}
                      // data-hook={}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() => HandleAddFieldToGeneralDailyReport(field)}
                >
                  Add field
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
