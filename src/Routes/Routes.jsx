import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  logoutPath,
  addEmployeePath,
  editEmployeePath,
  removeEmployeePath,
  addProductPath,
  editMoviePath,
  removeMoviePath
} from "../consts/paths";
import {
  handleLogin,
  handleLogout,
  handleAddEmployee,
  handleEditEmployee,
  handleRemoveEmployee,
  handleAddProduct,
  handleEditMovie,
  handleRemoveMovie
} from "../Handlers/Handlers";

import {
  Login,
  Logout,
  AddEmployee,
  EditEmployee,
  RemoveEmployee,
  AddProduct,
  EditMovie,
  RemoveMovie
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
        <Route
          path={addEmployeePath}
          component={() => (
            <AddEmployee handleAddEmployee={handleAddEmployee} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={editEmployeePath}
          component={() => (
            <EditEmployee handleEditEmployee={handleEditEmployee} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={removeEmployeePath}
          component={() => (
            <RemoveEmployee handleRemoveEmployee={handleRemoveEmployee} />
          )}
        />
      )}
      {props.isLogged && (
        <Route
          path={addProductPath}
          component={() => <AddProduct handleAddProduct={handleAddProduct} />}
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
