import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import CustomInput from "../../../Components/CustomInput/CustomInput.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import SelectDates from "../../../Components/SelectDates";
import EditTable from "../../../Components/Tables/EditTable";
import {
  handleGetMovies,
  handleGetSuppliers,
} from "../../../Handlers/Handlers";
const style = { justifyContent: "center", top: "auto" };

export default class AddMovieOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
      moviesNames: "",
      supplier: "",
      orderDate: new Date(),
      contactDetails: "",
      isOpened: false,
      openSecond: false,
    };
    this.setInitialState();
    this.toggleBox = this.toggleBox.bind(this);
    this.toggleSecondBox = this.toggleSecondBox.bind(this);
  }

  toggleBox() {
    this.setState((oldState) => ({ isOpened: !oldState.isOpened }));
  }

  toggleSecondBox() {
    this.setState((oldState) => ({ openSecond: !oldState.openSecond }));
    this.setState((oldState) => ({ isOpened: !oldState.isOpened }));
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ movies: state.result });
      });

    handleGetSuppliers(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ suppliers: state.result });
      });
  };

  setMovieName(event) {
    this.setState({ movieName: [{ name: event.target.value }] });
  }

  setMoviesNames = (names) => {
    this.setState({ moviesNames: names.map((item) => item.name) });
  };

  setSupplier = (supplier) => {
    this.setState({ supplier });
  };

  setOrderDate = (date) => {
    this.setState({ orderDate: date });
  };

  columns = [{ title: "Movie Name", field: "name" }];

  render() {
    const {
      orderDate,
      moviesNames,
      movieName,
      supplier,
      isOpened,
      openSecond,
    } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Create New Movie Order</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Add Movie Name"
                      id="movieName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      onChange={(event) => this.setMovieName(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <CardFooter>
                    <Button color="info" onClick={this.toggleBox}>
                      Add more movies
                    </Button>
                  </CardFooter>
                </GridContainer>
                {isOpened && (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <EditTable
                        columns={this.columns}
                        data={movieName}
                        setItems={this.setMoviesNames}
                        openSecondBox={this.toggleSecondBox}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
              {openSecond && (
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
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              )}
              {openSecond && (
                <CardFooter>
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
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
