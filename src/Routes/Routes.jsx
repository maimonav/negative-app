import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"; //DO NOT REMOVE ROUTER&LINK
import {
  loginPath,
  manageEmployeesPath,
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

import { handleLogin, handleCreateDailyReports } from "../Handlers/Handlers";

import {
  Login,
  ManageEmployees,
  ManageSuppliers,
  ManageReports,
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
      {props.isLogged && (
        <Route
          path={errorPagePath}
          component={() => <ErrorPage {...props} />}
        />
      )}
      {props.isLogged && <Route path={logFilePath} component={LogFile} />}
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
    </Switch>
  );
}
