import React from "react";
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import Button from "../../../Components/CustomButtons/Button.js";
import { Link } from "react-router-dom";
import {
  manageCafeteriaOrdersPath,
  manageMoviesOrdersPath,
} from "../../../consts/paths";
import {
  cafeteriaOrdersHook,
  moviesOrdersHook,
} from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class ManageOrders extends React.Component {
  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={5}>
            <Card style={{ backgroundColor: "#FFFFF0" }}>
              <CardHeader color="info">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <h4 style={{ margin: "auto" }}>Manage Orders</h4>
                  </GridItem>
                </GridContainer>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CardFooter>
                      <Link to={manageCafeteriaOrdersPath}>
                        <Button id={cafeteriaOrdersHook} color="info">
                          <p>Manage Products Orders</p>
                        </Button>
                      </Link>
                    </CardFooter>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CardFooter>
                      <Link to={manageMoviesOrdersPath}>
                        <Button id={moviesOrdersHook} color="info">
                          <p>Manage Movies Orders</p>
                        </Button>
                      </Link>
                    </CardFooter>
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
