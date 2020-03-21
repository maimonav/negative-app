import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  logoutPath,
  addEmployeePath,
  editEmployeePath,
  removeEmployeePath,
  addProductPath
} from "../consts/paths";
import {
  handleLogin,
  handleLogout,
  handleAddEmployee,
  handleEditEmployee,
  handleRemoveEmployee
} from "../Handlers/Handlers";

import {
  Login,
  Logout,
  AddEmployee,
  EditEmployee,
  RemoveEmployee,
  AddProduct
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
        <Route path={addProductPath} component={() => <AddProduct />} />
      )}
    </Switch>
  );
}