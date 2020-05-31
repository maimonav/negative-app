export const reportsPrettyTypes = [
  { title: "Daily" },
  { title: "General" },
  { title: "Inventory" },
  { title: "Movies" },
  { title: "Incomes" }
];

export const reportsTypes = {
  Inventory: "inventory_daily_report",
  General: "general_purpose_daily_report",
  Movies: "movies_daily_report",
  Incomes: "incomes_daily_report",
  Daily: "full_daily_report"
};

export const reportsTypesObj = Object.freeze({
  Inventory: "inventory_daily_report",
  General: "general_purpose_daily_report",
  Movies: "movies_daily_report",
  Incomes: "incomes_daily_report"
});

export const reportsTypesInverseObj = Object.freeze({
  inventory_daily_report: "Inventory",
  general_purpose_daily_report: "General",
  movies_daily_report: "Movies",
  incomes_daily_report: "Incomes"
});

export const optional = " - optional";

export const inventoryColumns = [
  {
    width: 200,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 150,
    label: "Employee",
    dataKey: "creatorEmployeeName"
  },
  {
    width: 150,
    label: "Product",
    dataKey: "productName"
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
    label: "Cafeteria Cash",
    dataKey: "cafeteriaCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Cafeteria CreditCard",
    dataKey: "cafeteriaCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets Cash",
    dataKey: "ticketsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tickets CreditCard",
    dataKey: "ticketsCreditCardRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs Cash",
    dataKey: "tabsCashRevenues",
    numeric: true
  },
  {
    width: 200,
    label: "Tabs CreditCard",
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

export const moviesColumns = [
  {
    width: 200,
    label: "Date",
    dataKey: "date"
  },
  {
    width: 120,
    label: "Name",
    dataKey: "name"
  },
  {
    width: 120,
    label: "Location",
    dataKey: "location",
    numeric: true
  },
  {
    width: 150,
    label: "Tickets Sales",
    dataKey: "numOfTicketsSales",
    numeric: true
  },
  {
    width: 150,
    label: "Tickets Assigned",
    dataKey: "numOfTicketsAssigned",
    numeric: true
  },
  {
    width: 150,
    label: "Sales Incomes",
    dataKey: "totalSalesIncomes",
    numeric: true
  },
  {
    width: 150,
    label: "Tickets Returns",
    dataKey: "totalTicketsReturns",
    numeric: true
  },
  {
    width: 150,
    label: "Fees",
    dataKey: "totalFees",
    numeric: true
  },
  {
    width: 200,
    label: "Revenues Without Cash",
    dataKey: "totalRevenuesWithoutCash",
    numeric: true
  },
  {
    width: 200,
    label: "Cash Incomes",
    dataKey: "totalCashIncomes",
    numeric: true
  }
];
