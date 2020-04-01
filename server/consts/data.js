//TODO: Example purpose only! Need to remove when backend is ready.
const dataExample = [
  { title: "movie" },
  { title: "admin" },
  { title: "supplier" },
  { title: "Ralph Hubbard" },
  {title: "order"}
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
  category: "Comedy",
};

exports.dataExample = dataExample;
exports.supplierDetails = supplierDetails;
exports.employeeDetails = employeeDetails;
exports.orderDetails = orderDetails;
exports.movieDetails = movieDetails;
