import React from "react";
import MaterialTable from "material-table";
import ComboBox from "../../Components/AutoComplete";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
import { tableIcons } from "./EditTable";

export default class CreateReportTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: this.props.columns
    };
  }

  setProductName = productName => {
    this.setState({ productName });
  };

  setQuantitySold(event) {
    this.setState({ quantitySold: event.target.value });
  }

  setQuantityThrown(event) {
    this.setState({ quantityThrown: event.target.value });
  }

  onRowAdd = () => {
    this.setState(prevState => {
      const data = [...prevState.data];
      data.push({
        productName: this.state.productName,
        quantitySold: this.state.quantitySold,
        quantityThrown: this.state.quantityThrown
      });
      const result = { ...prevState, data };
      this.props.onChangeInventoryData(result.data);
      return result;
    });
  };

  onRowDelete = oldData => {
    this.setState(prevState => {
      const data = [...prevState.data];
      data.splice(data.indexOf(oldData), 1);
      const result = { ...prevState, data };
      this.props.onChangeInventoryData(result.data);
      return result;
    });
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
                items={[{ title: "milk" }]}
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
                  labelText="Quantity thrown"
                  id="quantityThrown"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={event => this.setQuantityThrown(event)}
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
          },
          {
            icon: tableIcons.Delete,
            tooltip: "Delete",
            onClick: this.onRowDelete
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
            })
        }}
      />
    );
  }
}
