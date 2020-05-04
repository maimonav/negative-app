//TODO: Example purpose only! Need to remove when backend is ready.
const dataExample = [
  { title: "movie" },
  { title: "admin" },
  { title: "supplier" },
  { title: "Ralph Hubbard" },
  { title: "order" },
  { title: "product" }
];

const todayDate = new Date().toDateString();

const inventory_daily_report = [
  {
    date: todayDate,
    product: "Milk",
    employee: "Aviv",
    quantity_sold: 10,
    quantity_in_stock: 8,
    stock_thrown: 8
  },
  {
    date: todayDate,
    product: "Popcorn",
    employee: "Maor",
    quantity_sold: 2,
    quantity_in_stock: 10,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Coca-Cola",
    employee: "Yuval",
    quantity_sold: 6,
    quantity_in_stock: 5,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Beer",
    employee: "Seifan",
    quantity_sold: 15,
    quantity_in_stock: 8,
    stock_thrown: 9
  },
  {
    date: todayDate,
    product: "Milk",
    employee: "Aviv",
    quantity_sold: 10,
    quantity_in_stock: 8,
    stock_thrown: 8
  },
  {
    date: todayDate,
    product: "Popcorn",
    employee: "Maor",
    quantity_sold: 2,
    quantity_in_stock: 10,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Coca-Cola",
    employee: "Yuval",
    quantity_sold: 6,
    quantity_in_stock: 5,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Beer",
    employee: "Seifan",
    quantity_sold: 15,
    quantity_in_stock: 8,
    stock_thrown: 9
  },
  {
    date: todayDate,
    product: "Milk",
    employee: "Aviv",
    quantity_sold: 10,
    quantity_in_stock: 8,
    stock_thrown: 8
  },
  {
    date: todayDate,
    product: "Popcorn",
    employee: "Maor",
    quantity_sold: 2,
    quantity_in_stock: 10,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Coca-Cola",
    employee: "Yuval",
    quantity_sold: 6,
    quantity_in_stock: 5,
    stock_thrown: 3
  },
  {
    date: todayDate,
    product: "Beer",
    employee: "Seifan",
    quantity_sold: 15,
    quantity_in_stock: 8,
    stock_thrown: 9
  }
];

const incomes_daily_report = [
  {
    date: todayDate,
    employee: "Aviv",
    numOfTabsSales: 1,
    cafeteriaCashRevenues: 20,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 20.0,
    ticketsCreditCardRevenues: 15,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Maor",
    numOfTabsSales: 3,
    cafeteriaCashRevenues: 45,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 22,
    ticketsCreditCardRevenues: 31,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 100
  },
  {
    date: todayDate,
    employee: "Yuval",
    numOfTabsSales: 6,
    cafeteriaCashRevenues: 99,
    cafeteriaCreditCardRevenues: 15,
    ticketsCashRevenues: 66,
    ticketsCreditCardRevenues: 32,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Seifan",
    numOfTabsSales: 10,
    cafeteriaCashRevenues: 17,
    cafeteriaCreditCardRevenues: 83,
    ticketsCashRevenues: 21,
    ticketsCreditCardRevenues: 88,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 94
  },
  {
    date: todayDate,
    employee: "Aviv",
    numOfTabsSales: 1,
    cafeteriaCashRevenues: 20,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 20.0,
    ticketsCreditCardRevenues: 15,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Maor",
    numOfTabsSales: 3,
    cafeteriaCashRevenues: 45,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 22,
    ticketsCreditCardRevenues: 31,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 100
  },
  {
    date: todayDate,
    employee: "Yuval",
    numOfTabsSales: 6,
    cafeteriaCashRevenues: 99,
    cafeteriaCreditCardRevenues: 15,
    ticketsCashRevenues: 66,
    ticketsCreditCardRevenues: 32,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Seifan",
    numOfTabsSales: 10,
    cafeteriaCashRevenues: 17,
    cafeteriaCreditCardRevenues: 83,
    ticketsCashRevenues: 21,
    ticketsCreditCardRevenues: 88,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 94
  },
  {
    date: todayDate,
    employee: "Aviv",
    numOfTabsSales: 1,
    cafeteriaCashRevenues: 20,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 20.0,
    ticketsCreditCardRevenues: 15,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Maor",
    numOfTabsSales: 3,
    cafeteriaCashRevenues: 45,
    cafeteriaCreditCardRevenues: 30,
    ticketsCashRevenues: 22,
    ticketsCreditCardRevenues: 31,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 100
  },
  {
    date: todayDate,
    employee: "Yuval",
    numOfTabsSales: 6,
    cafeteriaCashRevenues: 99,
    cafeteriaCreditCardRevenues: 15,
    ticketsCashRevenues: 66,
    ticketsCreditCardRevenues: 32,
    tabsCashRevenues: 39,
    tabsCreditCardRevenues: 21
  },
  {
    date: todayDate,
    employee: "Seifan",
    numOfTabsSales: 10,
    cafeteriaCashRevenues: 17,
    cafeteriaCreditCardRevenues: 83,
    ticketsCashRevenues: 21,
    ticketsCreditCardRevenues: 88,
    tabsCashRevenues: 32,
    tabsCreditCardRevenues: 94
  }
];

const general_purpose_daily_report = [
  {
    date: todayDate,
    creatorEmployeeId: 1,
    additionalProps: [["Cash counted"], { "Cash counted": "true" }]
  }
];

const supplierDetails = "maimonaviv@gmail.com";

const employeeDetails = {
  password: "1234",
  firstName: "aviv",
  lastName: "maimon",
  permissions: "Director",
  contactDetails: "maimonaviv@gmail.com"
};

const orderDetails = {
  orderId: "5252",
  orderDate: "21/03/2020",
  supplierDetails: "Shufersal",
  products: "milk, snacks, drinks",
  productQuantity: "10, 50, 50"
};

const movieDetails = {
  movieName: "The Mask",
  movieKey: "5252",
  examinationRoom: "26",
  category: "Comedy"
};

const productDetails = {
  productName: "Milk",
  productCategory: "Milk",
  productPrice: "6",
  productQuantity: "100",
  productMaxQunatity: "150",
  productMimQunatity: "50"
};

const categoryDetails = {
  categoryName: "Milk",
  categoryParent: "Dairy products"
};

const productsAndQuantity = [
  { name: "Milk", quantity: "10" },
  { name: "Bamba", quantity: "30" },
  { name: "Popcorn", quantity: "50" }
];

exports.dataExample = dataExample;
exports.supplierDetails = supplierDetails;
exports.employeeDetails = employeeDetails;
exports.orderDetails = orderDetails;
exports.movieDetails = movieDetails;
exports.productDetails = productDetails;
exports.productsAndQuantity = productsAndQuantity;
exports.categoryDetails = categoryDetails;
exports.general_purpose_daily_report = general_purpose_daily_report;
exports.incomes_daily_report = incomes_daily_report;
exports.inventory_daily_report = inventory_daily_report;
