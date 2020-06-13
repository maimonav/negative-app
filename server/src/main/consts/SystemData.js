const { csvToJson } = require("../EventBuzzScript");
const moment = require("moment");

const addEmployeeArgsList = [
  [
    "manager",
    "manager123",
    "manager",
    "manager",
    "MANAGER",
    "tel - 052-123456789",
    "admin",
  ],
  [
    "deputy_manager",
    "deputy_manager123",
    "deputy_manager",
    "deputy_manager",
    "DEPUTY MANAGER",
    "tel - 052-123456789",
    "admin",
  ],
  [
    "shift_manager",
    "shift_manager123",
    "shift_manager",
    "shift_manager",
    "SHIFT_MANAGER",
    "tel - 052-123456789",
    "admin",
  ],
  [
    "employee",
    "employee123",
    "employee",
    "employee",
    "EMPLOYEE",
    "tel - 052-123456789",
    "admin",
  ],
];
const addMoviesArgsList = [
  ["Bad Boys For Life", "comedy", "manager"],
  ["Wonder Woman 1984", "action", "manager"],
  ["Once Upon a Time in Hollywood", "comedy", "manager"],
];
const addProductsArgsList = [
  ["Coca-Cola", 5, 50, 10, 100, "cola", "manager"],
  ["Zero-Cola", 5, 50, 10, 100, "cola", "manager"],
  ["Diet-Cola", 5, 0, 10, 100, "cola", "manager"],
  ["GoldStar", 10, 10, null, null, "beer", "manager"],
  ["Regular-Sprite", 5, 15, 5, 25, "sprite", "manager"],
  ["Zero-Sprite", 5, 15, null, null, "sprite", "manager"],
];
const addCategoriesArgsList = [
  ["drinks", "manager", ""],
  ["soft drinks", "manager", "drinks"],
  ["alcoholic drinks", "manager", "drinks"],
  ["beer", "manager", "alcoholic drinks"],
  ["cola", "manager", "soft drinks"],
  ["sprite", "manager", "soft drinks"],
  ["movies", "manager", ""],
  ["comedy", "manager", "movies"],
  ["action", "manager", "movies"],
];
const addMoviesOrdersArgsList = [
  [
    `manager - ` +
      moment(new Date(2020, 06, 10)).format("MMMM Do YYYY, h:mm:ss a"),
    new Date(2020, 06, 10),
    "Tedi Productions",
    JSON.parse('["Wonder Woman 1984"]'),
    "manager",
  ],
  [
    `manager - ` +
      moment(new Date(2020, 06, 11)).format("MMMM Do YYYY, h:mm:ss a"),
    new Date(2020, 06, 11),
    "Tedi Productions",
    JSON.parse('["Bad Boys For Life"]'),
    "manager",
  ],
];
const addProductsOrdersArgsList = [
  [
    `manager - ` +
      moment(new Date(2020, 06, 13)).format("MMMM Do YYYY, h:mm:ss a"),
    new Date(2020, 06, 13),
    "shufersal",
    JSON.parse(
      '[{"name":"Coca-Cola","quantity":"30"},{"name":"GoldStar","quantity":"10"}]'
    ),
    "manager",
  ],
  [
    `manager - ` +
      moment(new Date(2020, 06, 12)).format("MMMM Do YYYY, h:mm:ss a"),
    new Date(2020, 06, 12),
    "rami levi",
    JSON.parse(
      '[{"name":"Regular-Sprite","quantity":"30"},{"name":"Zero-Sprite","quantity":"35"}]'
    ),
    "manager",
  ],
];
const addSuppliersArgsList = [
  ["shufersal", "https://www.shufersal.co.il/online/", "manager"],
  ["rami levi", "https://www.rami-levy.co.il", "manager"],
  ["Tedi Productions", "Tel. 050-123456789", "manager"],
];
const addMoviesReportsArgsList = [
  [
    [
      {
        name: "Bad Boys For Life",
        date: "06.06.2020 21:00",
        location: "Auditorium 5",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "22",
        totalSalesIncomes: "172",
        totalTicketsReturns: "37.8",
        totalFees: "5.45",
        totalRevenuesWithoutCash: "65.75",
        totalCashIncomes: "63",
      },
      {
        name: "Wonder Woman",
        date: "06.06.2020 21:00",
        location: "Auditorium 5",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "0",
        totalSalesIncomes: "0",
        totalTicketsReturns: "0",
        totalFees: "0",
        totalRevenuesWithoutCash: "0",
        totalCashIncomes: "0",
      },
      {
        name: "Wonder Woman",
        date: "06.06.2020 00:00",
        location: "Auditorium 5",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "0",
        totalSalesIncomes: "0",
        totalTicketsReturns: "0",
        totalFees: "0",
        totalRevenuesWithoutCash: "0",
        totalCashIncomes: "0",
      },
      {
        name: "Bad Boys For Life",
        date: "06.06.2020 00:00",
        location: "Auditorium 6",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "22",
        totalSalesIncomes: "172",
        totalTicketsReturns: "37.8",
        totalFees: "5.45",
        totalRevenuesWithoutCash: "65.75",
        totalCashIncomes: "63",
      },
      {
        name: "Spiderman",
        date: "07.06.2020 21:00",
        location: "Auditorium 5",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "0",
        totalSalesIncomes: "0",
        totalTicketsReturns: "0",
        totalFees: "0",
        totalRevenuesWithoutCash: "0",
        totalCashIncomes: "0",
      },
      {
        name: "Bad Boys For Life",
        date: "07.06.2020 21:00",
        location: "Auditorium 5",
        numberOfTicketsAssigned: "250",
        numberOfTicketsSales: "22",
        totalSalesIncomes: "172",
        totalTicketsReturns: "37.8",
        totalFees: "5.45",
        totalRevenuesWithoutCash: "65.75",
        totalCashIncomes: "63",
      },
    ],
  ],
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
