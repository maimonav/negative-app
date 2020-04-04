import React from "react";
import MaterialTable from "material-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default class MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      columns: [
        { title: "Product Name", field: "name" },
        { title: "Quantity", field: "quantity" }
      ]
    };
  }
  //   const [state, setState] = React.useState({
  //     columns: [
  //       { title: "Product Name", field: "name" },
  //       { title: "Quantity", field: "quantity" }
  //     ],
  //     data: [
  //       { name: "Milk", quantity: "50" },
  //       {
  //         name: "Coca-Cola",
  //         quantity: "50"
  //       }
  //     ]
  //   });

    render() {
        console.log('state.data: ', this.state.data);
    return (
      <MaterialTable
        title="Editable Example"
        columns={this.state.columns}
        data={this.state.data}
        //   actions={[
        //     {
        //       icon: EditIcon,
        //       tooltip: "Edit",
        //       onRowUpdate: (newData, oldData) =>
        //         new Promise(resolve => {
        //           setTimeout(() => {
        //             resolve();
        //             if (oldData) {
        //               setState(prevState => {
        //                 const data = [...prevState.data];
        //                 data[data.indexOf(oldData)] = newData;
        //                 return { ...prevState, data };
        //               });
        //             }
        //           }, 600);
        //         })
        //     },
        //     {
        //       icon: DeleteIcon,
        //       tooltip: "Delete",
        //       onRowDelete: oldData =>
        //         new Promise(resolve => {
        //           setTimeout(() => {
        //             resolve();
        //             setState(prevState => {
        //               const data = [...prevState.data];
        //               data.splice(data.indexOf(oldData), 1);
        //               return { ...prevState, data };
        //             });
        //           }, 600);
        //         })
        //     }
        //   ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  this.setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            })
        }}
      />
    );
  }
}
