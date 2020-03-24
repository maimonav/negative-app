import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  logoutPath,
  manageEmployeesPath,
  addProductPath,
  editProductPath,
  removeProductPath,
  editMoviePath,
  removeMoviePath,
  addSupplierPath,
  editSupplierPath,
  removeSupplierPath
} from "../consts/paths";

import {
  handleLogin,
  handleLogout,
  handleAddProduct,
  handleEditProduct,
  handleRemoveProduct,
  handleEditMovie,
  handleRemoveMovie,
  handleAddSupplier,
  handleEditSupplier,
  handleRemoveSupplier
} from "../Handlers/Handlers";

import {
  Login,
  Logout,
  ManageEmployees,
  AddProduct,
  EditMovie,
  RemoveMovie,
  AddSupplier,
  EditSupplier,
  RemoveSupplier,
  EditProduct,
  RemoveProduct
} from "../Views/index";

export default function Routes(props) {
  return (
    <Switch>
      {!props.isLogged && (
        <Route
          exact
          path={loginPath}
          component={() => (
            <Login handleLogin={handleLogin} onLogin={props.onLogin} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={logoutPath}
          component={() => (
            <Logout handleLogout={handleLogout} onLogout={props.onLogout} />
          )}
        />
      )}
      {props.isLogged && (
        <Route path={manageEmployeesPath} component={ManageEmployees} />
      )}
      {props.isLogged && (
        <Route
          path={addProductPath}
          component={() => <AddProduct handleAddProduct={handleAddProduct} />}
        />
      )}
      {props.isLogged && (
        <Route
          path={editProductPath}
          component={() => (
            <EditProduct handleEditProduct={handleEditProduct} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={removeProductPath}
          component={() => (
            <RemoveProduct handleRemoveProduct={handleRemoveProduct} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={editMoviePath}
          component={() => <EditMovie handleEditMovie={handleEditMovie} />}
        />
      )}
      {props.isLogged && (
        <Route
          path={removeMoviePath}
          component={() => (
            <RemoveMovie handleRemoveMovie={handleRemoveMovie} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={addSupplierPath}
          component={() => (
            <AddSupplier handleAddSupplier={handleAddSupplier} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={editSupplierPath}
          component={() => (
            <EditSupplier handleEditSupplier={handleEditSupplier} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={removeSupplierPath}
          component={() => (
            <RemoveSupplier handleRemoveSupplier={handleRemoveSupplier} />
          )}
        />
      )}
    </Switch>
  );
}
