const { csvToJson } = require("./EventBuzzScript");

const addEmployeeArgsList = [];
const addMoviesArgsList = [];
const addProductsArgsList = [];
const addCategoriesArgsList = [];
const addMoviesOrdersArgsList = [];
const addProductsOrdersArgsList = [];
const addSuppliersArgsList = [];
const addMoviesReportsArgsList = [
  csvToJson()
    .slice(2, 6)
    .map((e) => (e.date = "07.11.2020 21:00")),
];
const addReportsArgsList = [];
const addFieldsArgsList = [];

module.exports = {
  addEmployeeArgsList,
  addMoviesArgsList,
  addProductsArgsList,
  addCategoriesArgsList,
  addMoviesOrdersArgsList,
  addProductsOrdersArgsList,
  addSuppliersArgsList,
  addMoviesReportsArgsList,
  addReportsArgsList,
  addFieldsArgsList,
};
