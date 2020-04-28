//TODO: Example purpose only! Need to remove when backend is ready.
const dataExample = [
  { title: "movie" },
  { title: "admin" },
  { title: "supplier" },
  { title: "Ralph Hubbard" },
  { title: "order" },
  { title: "product" },
];

const todayDate = new Date();

const inventory_daily_report = {
  date: todayDate,
  productId: 0,
  creatorEmployeeId: 1,
  quantitySold: 4,
  quantityInStock: 8,
  stockThrown: 8,
};

const incomes_daily_report = {
  date: todayDate,
  creatorEmployeeId: 1,
  numOfTabsSales: 0,
  cafeteriaCashRevenues: 20.0,
  cafeteriaCreditCardRevenues: 20.0,
  ticketsCashRevenues: 20.0,
  ticketsCreditCardRevenues: 20.0,
  tabsCashRevenues: 20.0,
  tabsCreditCardRevenues: 20.0,
};
const general_purpose_daily_report = {
  date: todayDate,
  creatorEmployeeId: 1,
  additionalProps: [["Cash counted"], { "Cash counted": "true" }],
};

const supplierDetails = "maimonaviv@gmail.com";

const employeeDetails = {
  password: "1234",
  firstName: "aviv",
  lastName: "maimon",
  permissions: "Director",
  contactDetails: "maimonaviv@gmail.com",
};

const orderDetails = {
  orderId: "5252",
  orderDate: "21/03/2020",
  supplierDetails: "Shufersal",
  products: "milk, snacks, drinks",
  productQuantity: "10, 50, 50",
};

const movieDetails = {
  movieName: "The Mask",
  movieKey: "5252",
  examinationRoom: "26",
  category: "Comedy",
};

const productDetails = {
  productName: "Milk",
  productCategory: "Milk",
  productPrice: "6",
  productQuantity: "100",
  productMaxQunatity: "150",
  productMimQunatity: "50",
};

const categoryDetails = {
  categoryName: "Milk",
  categoryParent: "Dairy products",
};

const productsAndQuantity = [
  { name: "Milk", quantity: "10" },
  { name: "Bamba", quantity: "30" },
  { name: "Popcorn", quantity: "50" },
];

exports.dataExample = dataExample;
exports.supplierDetails = supplierDetails;
exports.employeeDetails = employeeDetails;
exports.orderDetails = orderDetails;
exports.movieDetails = movieDetails;
exports.productDetails = productDetails;
exports.productsAndQuantity = productsAndQuantity;
exports.categoryDetails = categoryDetails;
