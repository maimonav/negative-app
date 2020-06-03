import React from "react";
// core components
import GridItem from "./Grid/GridItem";
import GridContainer from "./Grid/GridContainer.js";
import Card from "./Card/Card.js";
import CardHeader from "./Card/CardHeader.js";
import CardBody from "./Card/CardBody.js";
import Paper from "@material-ui/core/Paper";
import ComboBox from "./AutoComplete";
import CardFooter from "../Components/Card/CardFooter.js";
import Button from "../Components/CustomButtons/Button.js";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { handleGetLogContent } from "../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class LogFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logType: "",
      logContentFixed: [],
      showLog: false,
    };
  }

  logOptions = [{ title: "db" }, { title: "System" }];

  setCategoryName = (name) => {
    this.setState({ logType: name });
  };

  handleLog = () => {
    handleGetLogContent(this.state.logType)
      .then((response) => response.json())
      .then((state) => {
        this.setState({ logContent: state.result, showLog: true }, () =>
          this.fixString()
        );
      });
  };

  fixString() {
    const { logContent } = this.state;
    let tmpArray = logContent.split("\n");
    this.setState({ logContentFixed: tmpArray });
  }

  render() {
    const { logContentFixed, showLog } = this.state;
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
                    />
                  </GridItem>
                </GridContainer>
                <CardFooter>
                  <Button color="info" onClick={this.handleLog}>
                    Show log content
                  </Button>
                </CardFooter>
                {showLog && (
                  <GridContainer
                    style={{ maxHeight: "100%", overflow: "auto" }}
                  >
                    <GridItem xs={12} sm={12} md={8}>
                      <Typography variant="h6">System Log File:</Typography>
                      <div>
                        <Paper
                          style={{
                            maxHeight: 400,
                            overflow: "auto",
                            width: 1000,
                          }}
                        >
                          <List>
                            {logContentFixed.map((log, key) => (
                              <ListItem key={key}>
                                <ListItemText primary={log} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </div>
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
