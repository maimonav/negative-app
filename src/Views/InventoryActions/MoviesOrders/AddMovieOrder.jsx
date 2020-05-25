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
import SelectDates from "../../../Components/SelectDates";
import {
  handleGetMovies,
  handleGetSuppliers
} from "../../../Handlers/Handlers";
import { userNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class AddMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesNames: "",
      supplier: "",
      orderDate: new Date()
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ movies: state.result });
      });

    handleGetSuppliers(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ suppliers: state.result });
      });
  };

  setMoviesNames = names => {
    this.setState({ moviesNames: names.map(item => item.title) });
  };

  setSupplier = supplier => {
    this.setState({ supplier });
  };

  setOrderDate = date => {
    this.setState({ orderDate: date });
  };

  render() {
    const { orderDate, moviesNames, supplier } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Create New Movie Order</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"moviesName"}
                      items={this.state.movies}
                      boxLabel={"Choose movies to order"}
                      setName={this.setMoviesNames}
                      isMultiple={true}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardBody>
                <GridContainer>
                  <GridItem>
                    <SelectDates
                      id={"add-movie-order-date"}
                      label={"Choose Movie Order Date"}
                      setDate={this.setOrderDate}
                      date={this.state.orderDate}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplier"}
                      items={this.state.suppliers}
                      boxLabel={"Choose supplier"}
                      setName={this.setSupplier}
                      isMultiple={false}
                      data-hook={userNameHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() =>
                    this.props.handleAddMovieOrder(
                      orderDate,
                      supplier,
                      moviesNames
                    )
                  }
                >
                  Create New Order
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
