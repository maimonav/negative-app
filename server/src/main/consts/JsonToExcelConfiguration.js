const incomesReportColumns = [
  { label: "Date", value: "date" },
  { label: "Employee", value: "creatorEmployeeName" },
  { label: "Tabs Sales", value: "numOfTabsSales" },
  { label: "Cafeteria Cash", value: "cafeteriaCashRevenues" },
  {
    label: "Cafeteria CreditCard",
    value: "cafeteriaCreditCardRevenues"
  },
  { label: "Tickets Cash", value: "ticketsCashRevenues" },
  {
    label: "Tickets CreditCard",
    value: "ticketsCreditCardRevenues"
  },
  { label: "Tabs Cash", value: "tabsCashRevenues" },
  {
    label: "Tabs CreditCard",
    value: "tabsCreditCardRevenues"
  }
];

const inventoryReportColumns = [
  { label: "Date", value: "date" },
  { label: "Employee", value: "creatorEmployeeName" },
  { label: "Tabs Sales", value: "productName" },
  { label: "Quantity Sold", value: "quantitySold" },
  { label: "Stock Thrown", value: "stockThrown" },
  { label: "Quantity In Stock", value: "quantityInStock" }
];

let generalReportColumns = [
  { label: "Date", value: "date" },
  { label: "Employee", value: "creatorEmployeeName" }
];

const moviesReportColumns = [
  { label: "Date", value: "date" },
  { label: "Name", value: "name" },
  { label: "Location", value: "location" },
  { label: "Tickets Sales", value: "numOfTicketsSales" },
  { label: "Tickets Assigned", value: "numOfTicketsAssigned" },
  { label: "Sales Incomes", value: "totalSalesIncomes" },
  { label: "Tickets Returns", value: "totalTicketsReturns" },
  { label: "Fees", value: "totalFees" },
  {
    label: "Revenues Without Cash",
    value: "totalRevenuesWithoutCash"
  },
  { label: "Cash Incomes", value: "totalCashIncomes" }
];

<<<<<<< Updated upstream
const relativeFilePath = fileName => `./server/src/main/reports/${fileName}`;
=======
const relativeFilePath = (fileName) => `./server/src/main/reports/${fileName}`;
>>>>>>> Stashed changes

const incomesReportSettings = {
  sheetName: "Incomes Report",
  fileName: relativeFilePath("Incomes Report"),
<<<<<<< Updated upstream
  extraLength: 5
=======
  extraLength: 5,
>>>>>>> Stashed changes
};
const inventoryReportSettings = {
  sheetName: "Inventory Report",
  fileName: relativeFilePath("Inventory Report"),
<<<<<<< Updated upstream
  extraLength: 5
=======
  extraLength: 5,
>>>>>>> Stashed changes
};
const generalReportSettings = {
  sheetName: "General Report",
  fileName: relativeFilePath("General Report"),
<<<<<<< Updated upstream
  extraLength: 5
=======
  extraLength: 5,
>>>>>>> Stashed changes
};
const moviesReportSettings = {
  sheetName: "Movies Report",
  fileName: relativeFilePath("Movies Report"),
<<<<<<< Updated upstream
  extraLength: 5
=======
  extraLength: 5,
>>>>>>> Stashed changes
};

const settings = {
  incomes_daily_report: incomesReportSettings,
  inventory_daily_report: inventoryReportSettings,
  general_purpose_daily_report: generalReportSettings,
  movies_daily_report: moviesReportSettings
};

const columns = {
  incomes_daily_report: incomesReportColumns,
  inventory_daily_report: inventoryReportColumns,
  general_purpose_daily_report: generalReportColumns,
  movies_daily_report: moviesReportColumns
};

const fileNames = {
  incomes_daily_report: "Incomes Report",
  inventory_daily_report: "Inventory Report",
  general_purpose_daily_report: "General Report",
  movies_daily_report: "Movies Report",
};

module.exports = {
  settings,
<<<<<<< Updated upstream
  columns
=======
  columns,
  fileNames,
>>>>>>> Stashed changes
};
