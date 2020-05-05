export const reportsPrettyTypes = [
  { title: "Inventory" },
  { title: "General" },
  // { title: "Movies" },
  { title: "Incomes" }
];

export const reportsTypes = {
  Inventory: "inventory_daily_report",
  General: "general_purpose_daily_report",
  Movies: "movie_daily_report",
  Incomes: "incomes_daily_report"
};

export const reportsTypesObj = Object.freeze({
  Inventory: "inventory_daily_report",
  General: "general_purpose_daily_report",
  Movies: "movie_daily_report",
  Incomes: "incomes_daily_report"
});

export const inventoryColumns = [
  {
    width: 200,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 150,
    label: "Product",
    dataKey: "productName"
  },
  {
    width: 150,
    label: "Employee",
    dataKey: "creatorEmployeeName"
  },
  {
    width: 150,
    label: "Quantity Sold",
    dataKey: "quantitySold",
    numeric: true
  },
  {
    width: 150,
    label: "Quantity In Stock",
    dataKey: "quantityInStock",
    numeric: true
  },
  {
    width: 150,
    label: "Stock Thrown",
    dataKey: "stockThrown",
    numeric: true
  }
];

export const incomesColumns = [
  {
    width: 150,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 120,
    label: "Employee",
    dataKey: "creatorEmployeeName"
  },
  {
    width: 120,
    label: "Tabs Sales",
    dataKey: "numOfTabsSales",
    numeric: true
  },
  {
    width: 200,
    label: "Cafeteria Credit Incomes",
    dataKey: "cafeteriaCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets Cash Incomes",
    dataKey: "ticketsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets Credit Incomes",
    dataKey: "ticketsCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs Cash Incomes",
    dataKey: "tabsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs Credit Incomes",
    dataKey: "tabsCreditCardRevenues",
    numeric: true
  }
];

export const generalColumns = [
  {
    width: 150,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 120,
    label: "Employee",
    dataKey: "creatorEmployeeName"
  }
];
