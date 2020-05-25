import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  manageEmployeesPath,
  editMoviePath,
  removeMoviePath,
  manageSuppliersPath,
  manageReportsPath,
  manageInventoryPath,
  manageCafeteriaOrdersPath,
  manageCategoriesPath,
  manageMoviesPath,
  showReportPath,
  createDailyReportPath,
  manageOrdersPath,
  manageMoviesOrdersPath,
  errorPagePath,
  logFilePath,
} from "../consts/paths";

import {
  handleLogin,
  handleEditMovie,
  handleRemoveMovie,
  handleCreateDailyReports,
} from "../Handlers/Handlers";

import {
  Login,
  ManageEmployees,
  ManageSuppliers,
  ManageReports,
  EditMovie,
  RemoveMovie,
  ManageInventory,
  ManageCafeteriaOrders,
  ManageMovies,
  ShowReport,
  CreateDailyReport,
  ManageCategories,
  ManageOrders,
  ManageMoviesOrders,
  ErrorPage,
  LogFile,
} from "../Views/index";

export default function Routes(props) {
  return (
    <Switch>
      {<Route path={errorPagePath} component={ErrorPage} />}
      {!props.isLogged && (
        <Route
          path={loginPath}
          component={() => (
            <Login handleLogin={handleLogin} onLogin={props.onLogin} />
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

      {props.isLogged && (
        <Route path={manageReportsPath} component={ManageReports} />
      )}
      {props.isLogged && <Route path={showReportPath} component={ShowReport} />}
      {props.isLogged && (
        <Route
          path={createDailyReportPath}
          component={() => (
            <CreateDailyReport
              handleCreateDailyReports={handleCreateDailyReports}
            />
          )}
        />
      )}
      {props.isLogged && (
        <Route path={logFilePath} component={() => <LogFile />} />
      )}
    </Switch>
  );
}
