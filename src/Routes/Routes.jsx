import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  logoutPath,
  manageEmployeesPath,
  editMoviePath,
  removeMoviePath,
  manageSuppliersPath,
  manageInventoryPath,
  manageCafeteriaOrdersPath,
  manageCategoriesPath,
  manageMoviesPath,
  showReportPath,
  manageOrdersPath,
  manageMoviesOrdersPath
} from "../consts/paths";

import {
  handleLogin,
  handleLogout,
  handleEditMovie,
  handleRemoveMovie
} from "../Handlers/Handlers";

import {
  Login,
  Logout,
  ManageEmployees,
  ManageSuppliers,
  EditMovie,
  RemoveMovie,
  ManageInventory,
  ManageCafeteriaOrders,
  ManageMovies,
  ShowReport,
  ManageCategories,
  ManageOrders,
  ManageMoviesOrders
} from "../Views/index";

export default function Routes(props) {
  return (
    <Switch>
      {!props.isLogged && (
        <Route
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
          path={manageInventoryPath}
          component={() => <ManageInventory {...props} />}
        />
      )}
      {props.isLogged && (
        <Route
          path={manageCafeteriaOrdersPath}
          component={() => <ManageCafeteriaOrders {...props} />}
        />
      )}
      {props.isLogged && (
        <Route path={manageMoviesPath} component={ManageMovies} />
      )}
      {props.isLogged && (
        <Route path={manageOrdersPath} component={ManageOrders} />
      )}
      {props.isLogged && (
        <Route
          path={manageMoviesOrdersPath}
          component={() => <ManageMoviesOrders {...props} />}
        />
      )}
      {props.isLogged && (
        <Route
          path={manageCategoriesPath}
          component={() => <ManageCategories />}
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

      {props.isLogged && <Route path={showReportPath} component={ShowReport} />}
    </Switch>
  );
}
