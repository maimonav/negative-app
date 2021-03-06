import React from "react";
import MaterialTable from "material-table";
import ComboBox from "../../Components/AutoComplete";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
import { tableIcons } from "./EditTable";
import { handleGetCafeteriaProducts } from "../../Handlers/Handlers";

export default class CreateReportTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: this.props.columns
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetCafeteriaProducts()
      .then(response => response.json())
      .then(state => {
        this.setState({ products: state.result });
      });
  };

  setProductName = productName => {
    this.setState({ productName });
  };

  setQuantitySold(event) {
    this.setState({ quantitySold: event.target.value });
  }

  setStockThrown(event) {
    this.setState({ stockThrown: event.target.value });
  }

  onRowAdd = () => {
    if (this.state.productName) {
      this.setState(prevState => {
        const data = [...prevState.data];
        data.push({
          productName: this.state.productName,
          quantitySold: this.state.quantitySold,
          stockThrown: this.state.stockThrown
        });
        const result = { ...prevState, data };
        this.props.onChangeInventoryData(result.data);
        return result;
      });
    }
  };

  render() {
    const { columns, data } = this.state;
    return (
      <MaterialTable
        id={"createReportTable"}
        data={data}
        title={
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start"
              }}
            >
              <ComboBox
                id="product"
                items={this.state.products}
                boxLabel={"Choose product"}
                setName={this.setProductName}
                isMultiple={false}
                data-hook={""}
              />
              <div style={{ marginLeft: "30px" }}>
                <CustomInput
                  labelText="Quantity sold"
                  id="quantitySold"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={event => this.setQuantitySold(event)}
                  data-hook={""}
                />
              </div>
              <div style={{ marginLeft: "30px" }}>
                <CustomInput
                  labelText="Stock thrown"
                  id="stockThrown"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={event => this.setStockThrown(event)}
                  data-hook={""}
                />
              </div>
            </div>
          </>
        }
        options={{ search: false, actionsColumnIndex: -1 }}
        actions={[
          {
            icon: tableIcons.Add,
            tooltip: "Add product",
            isFreeAction: true,
            onClick: this.onRowAdd
          }
        ]}
        columns={columns}
        icons={tableIcons}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  this.setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    const result = { ...prevState, data };
                    this.props.onChangeInventoryData(result.data);
                    return result;
                  });
                }
              });
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  const result = { ...prevState, data };
                  this.props.onChangeInventoryData(result.data);
                  return result;
                });
              });
            })
        }}
      />
    );
  }
}
