import React from "react";
// core components
import GridItem from "./Grid/GridItem";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import ComboBox from "./AutoComplete";
import { handleGetLogContent } from "../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class LogFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logType: "",
    };
  }

  logOptions = [{ title: "db" }, { title: "System" }];

  setCategoryName = (name) => {
    this.setState({ logType: name }, () => {
      handleGetLogContent(this.state.logType)
        .then((response) => response.json())
        .then((state) => {
          this.setState({ logContent: state.result }, () =>
            console.log("log:", this.state.logContent)
          );
        });
    });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info" style={{ maxHeight: "50px" }}>
                <h4 style={{ margin: "auto" }}>Present Log of the system</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <ComboBox
                      id={"logType"}
                      items={this.logOptions}
                      boxLabel={"Choose log type"}
                      setName={this.setCategoryName}
                      isMultiple={false}
                      // data-hook={categoryNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <h3
                      style={{
                        margin: "auto",
                        marginTop: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      System Log File:{" "}
                    </h3>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
