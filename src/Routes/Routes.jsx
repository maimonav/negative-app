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
  manageSuppliersPath
} from "../consts/paths";

import {
  handleLogin,
  handleLogout,
  handleAddProduct,
  handleEditProduct,
  handleRemoveProduct,
  handleEditMovie,
  handleRemoveMovie
} from "../Handlers/Handlers";

import {
  Login,
  Logout,
  ManageEmployees,
  ManageSuppliers,
  AddProduct,
  EditMovie,
  RemoveMovie,
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
        <Route path={manageSuppliersPath} component={ManageSuppliers} />
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
    </Switch>
  );
}
