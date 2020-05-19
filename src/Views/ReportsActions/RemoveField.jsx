import React from "react";
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
import ComboBox from "../../Components/AutoComplete";
import {
  handleGetFieldsGeneralDailyReport,
  HandleRemoveFieldToGeneralDailyReport
} from "../../Handlers/Handlers";
import Button from "../../Components/CustomButtons/Button.js";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setInitialState();
  }
  setInitialState = () => {
    handleGetFieldsGeneralDailyReport()
      .then(response => response.json())
      .then(state => {
        this.setState({ fields: state.result });
      });
  };

  setField = field => {
    this.setState({ field });
  };

  render() {
    const { field } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>
                  Remove field from General Daily report
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplierName"}
                      items={this.state.fields}
                      boxLabel={"Choose field"}
                      setName={this.setField}
                      isMultiple={false}
                      // data-hook={}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() => HandleRemoveFieldToGeneralDailyReport(field)}
                >
                  Remove field
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
