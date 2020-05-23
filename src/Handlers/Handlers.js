import moment from "moment";
/**
 * Handle login to system
 * @param {string} username
 * @param {string} password
 * @param {callback} onLogin
 * @returns void
 */
export function handleLogin(username, password, onLogin) {
  fetch(
    `/api/login?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`
  )
    .then(response => response.json())
    .then(state => {
      if (
        state.result &&
        typeof state.result !== "string" &&
        state.result[0] === "User Logged in succesfully."
      ) {
        onLogin(username, state.result[1]);
        alert(state.result[0]);
      } else {
        alert(state.result);
      }
    });
}
/**
 * Handle logout from system
 * @param {callback} onLogout
 * @returns void
 */
export function handleLogout(onLogout) {
  const username = localStorage.getItem("username");
  fetch(`/api/logout?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(state => {
      onLogout();
      alert(state.result);
    });
}
/**
 * Handle add new employee to system
 * @param {string} userName
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} permission
 * @param {string} contactDetails
 * @returns void
 */
export function handleAddEmployee(
  userName,
  password,
  firstName,
  lastName,
  permission,
  contactDetails
) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addNewEmployee?userName=${encodeURIComponent(
      userName
    )}&password=${encodeURIComponent(password)}&firstName=${encodeURIComponent(
      firstName
    )}
      &lastName=${encodeURIComponent(lastName)}&permission=${encodeURIComponent(
      permission
    )}&contactDetails=${encodeURIComponent(
      contactDetails
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}
/**
 * Handle edit employee from system
 * @param {string} userName
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} permission
 * @param {string} contactDetails
 * @returns void
 */
export function handleEditEmployee(
  userName,
  password,
  firstName,
  lastName,
  permission,
  contactDetails
) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editEmployee?userName=${encodeURIComponent(
      userName
    )}&password=${encodeURIComponent(password)}&firstName=${encodeURIComponent(
      firstName
    )}
      &lastName=${encodeURIComponent(lastName)}&permission=${encodeURIComponent(
      permission
    )}&contactDetails=${encodeURIComponent(
      contactDetails
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}
/**
 * Handle remove employee from system
 * @param {string} userName
 * @returns void
 */
export function handleRemoveEmployee(userName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeEmployee?userName=${encodeURIComponent(
      userName
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new product to system
 * @param {string} productName
 * @param {string} productPrice
 * @param {string} productQuantity
 * @param {string} maxQuantity
 * @param {string} minQuantity
 * @param {string} productCategory
 * @returns void
 */
export function handleAddProduct(
  productName,
  productPrice,
  productQuantity,
  maxQuantity,
  minQuantity,
  productCategory
) {
  if (
    productName === "" ||
    productPrice === "" ||
    productQuantity === "" ||
    maxQuantity === "" ||
    minQuantity === "" ||
    productCategory === ""
  ) {
    alert("All product fields are required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/addNewProduct?productName=${encodeURIComponent(
      productName
    )}&productPrice=${encodeURIComponent(
      productPrice
    )}&productQuantity=${encodeURIComponent(productQuantity)}
      &maxQuantity=${encodeURIComponent(
        maxQuantity
      )}&minQuantity=${encodeURIComponent(
      minQuantity
    )}&productCategory=${encodeURIComponent(
      productCategory
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new product to system
 * @param {string} productName
 * @param {string} productPrice
 * @param {string} productQuantity
 * @param {string} maxQuantity
 * @param {string} minQuantity
 * @param {string} productCategory
 * @returns void
 */
export function handleEditProduct(
  productName,
  productPrice,
  productQuantity,
  maxQuantity,
  minQuantity,
  productCategory
) {
  if (productName === "") {
    alert("Product name is required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/editProduct?productName=${encodeURIComponent(
      productName
    )}&productPrice=${encodeURIComponent(
      productPrice
    )}&productQuantity=${encodeURIComponent(productQuantity)}
      &maxQuantity=${encodeURIComponent(
        maxQuantity
      )}&minQuantity=${encodeURIComponent(
      minQuantity
    )}&productCategory=${encodeURIComponent(
      productCategory
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new product to system
 * @param {string} productName
 * @returns void
 */
export function handleRemoveProduct(productName) {
  if (productName === "") {
    alert("Product name is required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/removeProduct?productName=${encodeURIComponent(productName)}
    &user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new movies to system
 * @param {string} orderDate
 * @param {string} supplierName
 * @param {string} moviesName
 * @returns void
 */
export function handleAddMovieOrder(orderDate, supplierName, moviesName) {
  if (moviesName === "") {
    alert("Movie name is required");
    return;
  }
  if (supplierName === "") {
    alert("Supplier name is required");
    return;
  }
  const user = localStorage.getItem("username");
  const date = moment(orderDate).format("MMMM Do YYYY, h:mm:ss a");
  const orderId = `${user} - ${date}`;
  fetch(
    `api/addMovieOrder?orderId=${encodeURIComponent(orderId)}
    &orderDate=${encodeURIComponent(orderDate)}
    &supplierName=${encodeURIComponent(supplierName)}
    &moviesName=${JSON.stringify(moviesName)}
    &user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new movie to system
 * @param {string} movieName
 * @param {string} category
 * @returns void
 */
export function handleAddMovie(movieName, category) {
  if (movieName === "") {
    alert("movie name is required");
    return;
  }
  if (category === "") {
    alert("category is required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/addMovie?movieName=${encodeURIComponent(
      movieName
    )}&category=${encodeURIComponent(category)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle edit movie in system
 * @param {string} movieName
 * @param {string} category
 * @param {string} key
 * @param {string} examinationRoom
 * @returns void
 */
export function handleEditMovie(movieName, category, key, examinationRoom) {
  if (movieName === "") {
    alert("movie name is required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/editMovie?movieName=${encodeURIComponent(
      movieName
    )}&category=${encodeURIComponent(category)}&key=${encodeURIComponent(
      key
    )}&examinationRoom=${encodeURIComponent(
      examinationRoom
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}
/**
 * Handle remove movie from system
 * @param {string} movieName
 */
export function handleRemoveMovie(movieName) {
  if (movieName === "") {
    alert("movie name is required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/removeMovie?movieName=${encodeURIComponent(
      movieName
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}
/**
 * Handle add supplier to system
 * @param {string} name
 * @param {string} contactDetails
 * @returns void
 */
export function handleAddSupplier(name, contactDetails) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addNewSupplier?name=${encodeURIComponent(
      name
    )}&contactDetails=${encodeURIComponent(
      contactDetails
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle edit supplier
 * @param {string} name
 * @param {string} contactDetails
 * @returns void
 */
export function handleEditSupplier(name, contactDetails) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editSupplier?name=${encodeURIComponent(
      name
    )}&contactDetails=${encodeURIComponent(
      contactDetails
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle remove supplier from system
 * @param {string} name
 * @returns void
 */
export function handleRemoveSupplier(name) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeSupplier?name=${encodeURIComponent(
      name
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new category to system
 * @param {string} categoryName
 * @param {string} parentName
 * @returns void
 */
export function handleAddCategory(categoryName, parentName) {
  if (categoryName === "") {
    alert("category name are required");
    return;
  }
  const user = localStorage.getItem("username");
  fetch(
    `api/addCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&parentName=${encodeURIComponent(parentName)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle edit category
 * @param {string} categoryName
 * @param {string} parentName
 * @returns void
 */
export function handleEditCategory(categoryName, parentName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&parentName=${encodeURIComponent(parentName)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle remove category
 * @param {string} categoryName
 * @returns void
 */
export function handleRemoveCategory(categoryName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add new cafeteria order to system
 * @param {string} productsName
 * @param {string} supplierName
 * @param {string} orderDate
 * @returns void
 */
export function handleAddCafeteriaOrder(productsName, supplierName, orderDate) {
  const productsList = JSON.stringify(productsName);
  const user = localStorage.getItem("username");
  const date = moment(orderDate).format("MMMM Do YYYY, h:mm:ss a");
  const orderId = `${user} , ${date}`;
  fetch(
    `api/addCafeteriaOrder?orderId=${encodeURIComponent(orderId)}
    &productsList=${productsList}&supplierName=${encodeURIComponent(
      supplierName
    )}&orderDate=${encodeURIComponent(orderDate)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle edit cafeteria order
 * @param {string} orderId
 * @param {string} orderDate
 * @param {string} updatedProductsAndQuantity
 * @returns void
 */
export function handleEditCafeteriaOrder(
  orderId,
  orderDate,
  updatedProductsAndQuantity
) {
  const user = localStorage.getItem("username");
  const updatedProducts = JSON.stringify(updatedProductsAndQuantity);
  fetch(
    `api/editCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&orderDate=${encodeURIComponent(
      orderDate
    )}&updatedProducts=${encodeURIComponent(
      updatedProducts
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle remove order from system
 * @param {string} orderId
 * @returns void
 */
export function handleRemoveOrder(orderId) {
  const user = localStorage.getItem("username");
  fetch(
    `api/RemoveOrder?orderId=${encodeURIComponent(
      orderId
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle confirm cafeteria order in system
 * @param {string} orderId
 * @param {string} updatedProductsAndQuantity
 * @returns void
 */
export function handleConfirmCafeteriaOrder(
  orderId,
  updatedProductsAndQuantity
) {
  const user = localStorage.getItem("username");
  const updatedProducts = JSON.stringify(updatedProductsAndQuantity);
  fetch(
    `api/confirmCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&updatedProducts=${encodeURIComponent(
      updatedProducts
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle get products in system
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} isCafeteriaOrder
 * @returns {Promise(Array)} array of orders
 */
export function handleGetOrdersByDates(startDate, endDate, isCafeteriaOrder) {
  return fetch(
    `api/getOrdersByDates?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(
      endDate
    )}&isCafeteriaOrder=${encodeURIComponent(isCafeteriaOrder)}`
  );
}

/**
 * Handle get products in system
 * @param {string} orderName
 * @returns {Promise(Array)} array of products
 */
export function handleGetProductsAndQuantityByOrder(orderName) {
  return fetch(
    `api/getProductAndQuntityByOrder?orderName=${encodeURIComponent(orderName)}`
  );
}

/**
 * Handle get suppliers in system
 * @param {string} username
 * @returns {Promise(Array)} array of suppliers
 */
export function handleGetSuppliers(username) {
  return fetch(`/api/getSuppliers?user=${encodeURIComponent(username)}`);
}

/**
 * Handle get employees in system
 * @param {string} username
 * @returns {Promise(Array)} array of employees
 */
export function handleGetEmployees(username) {
  return fetch(`/api/getEmployees?user=${encodeURIComponent(username)}`);
}

/**
 * Handle get movies in system
 * @param {string} username
 * @returns {Promise(Array)} array of movies
 */
export function handleGetMovies(username) {
  return fetch(`/api/getMovies?user=${encodeURIComponent(username)}`);
}

/**
 * Handle get categories from system
 * @returns {Promise(Array)} array of categories
 */
export function handleGetCategories() {
  return fetch(`/api/getCategories`);
}

/**
 * Handle get cafeteria products from system
 * @returns {Promise(Array)} array of categories
 */
export function handleGetCafeteriaProducts() {
  return fetch(`/api/getCafeteriaProducts`);
}

/**
 * Handle get orders from system
 * @returns {Promise(Array)} array of orders
 */
export function handleGetCafeteriaOrders() {
  return fetch(`/api/getCafeteriaOrders`);
}

/**
 * Handle get supplier's details
 * @param {string} supplier
 * @param {string} user
 * @returns {Promise(string)} contact details of supplier
 */
export function handleGetSupplierDetails(supplier, user) {
  return fetch(
    `/api/getSupplierDetails?supplier=${encodeURIComponent(
      supplier
    )}&user=${encodeURIComponent(user)}`
  );
}

/**
 * Handle get employee's details
 * @param {string} employee
 * @param {string} user
 * @returns {Promise(string)} contact details of employee
 */
export function handleGetEmployeeDetails(employee, user) {
  return fetch(
    `/api/getEmployeeDetails?employee=${encodeURIComponent(
      employee
    )}&user=${encodeURIComponent(user)}`
  );
}

/**
 * Handle get order details from system
 * @param {string} order
 * @returns {Promise(string)} details of orders
 */
export function handleGetOrderDetails(order) {
  return fetch(`/api/getOrderDetails?order=${encodeURIComponent(order)}`);
}

/**
 * Handle get movie details from system
 * @param {string} movieName
 * @returns {Promise(string)} details of movie
 */
export function handleGetMovieDetails(movieName) {
  return fetch(
    `/api/getMovieDetails?movieName=${encodeURIComponent(movieName)}`
  );
}

/**
 * Handle get product details from system
 * @param {string} productName
 * @returns {Promise(string)} details of product
 */
export function handleGetProductDetails(productName) {
  return fetch(
    `/api/getProductDetails?productName=${encodeURIComponent(productName)}`
  );
}

/**
 * Handle get category details from system
 * @param {string} categoryName
 * @returns {Promise(string)} details of category
 */
export function handleGetCategoryDetails(categoryName) {
  return fetch(
    `/api/getCategoryDetails?categoryName=${encodeURIComponent(categoryName)}`
  );
}
/**
 * Handle get report from system
 * @param {string} reportType
 * @param {Date} date
 * @param {string} user
 * @returns {Promise(Array || string)} Success - array, Failure - string error message
 */
export function handleGetReport(reportType, date, user) {
  return fetch(
    `/api/getReport?reportType=${encodeURIComponent(
      reportType
    )}&date=${encodeURIComponent(date)}&user=${encodeURIComponent(user)}`
  );
}
/**
 * Handle is logged to system
 * @param {string} username
 * @returns {Promise(bool)} bool if user logged in or not
 */
export function handleIsLoggedIn(username) {
  return fetch(`/api/isLoggedIn?username=${encodeURIComponent(username)}`);
}

/**
 * Handle get movies orders from system
 * @returns {Promise(array)} array of movies orders
 */
export function handleGetMovieOrders() {
  return fetch(`/api/getMovieOrders?`);
}

/**
 * Handle get order details from system
 * @param {string} order
 * @returns {Promise(string)} details of order
 */
export function handleGetMovieOrderDetails(order) {
  return fetch(`/api/getMovieOrderDetails?order=${encodeURIComponent(order)}`);
}

/**
 * Handle confirm order from system
 * @param {string} orderId
 * @param {string} updatedMovies
 * @returns void
 */
export function handleConfirmMovieOrder(orderId, updatedMovies) {
  const user = localStorage.getItem("username");
  const movieList = JSON.stringify(updatedMovies);
  fetch(
    `api/confirmMovieOrder?orderId=${encodeURIComponent(
      orderId
    )}&movieList=${encodeURIComponent(movieList)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle edit movie order system
 * @param {string} orderId
 * @param {string} orderDate
 * @param {string} updatedMovies
 * @returns void
 */
export function handleEditMovieOrder(orderId, orderDate, updatedMovies) {
  const user = localStorage.getItem("username");
  const updatedProducts = JSON.stringify(updatedMovies);
  fetch(
    `api/editMovieOrder?orderId=${encodeURIComponent(
      orderId
    )}&orderDate=${encodeURIComponent(
      orderDate
    )}&updatedProducts=${encodeURIComponent(
      updatedProducts
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle create daily reports
 * @param {*} reports
 * @returns void
 */
export function handleCreateDailyReports(reports) {
  const user = localStorage.getItem("username");
  const date = new Date();
  reports = JSON.stringify(reports);
  fetch(
    `api/createDailyReport?date=${encodeURIComponent(
      date
    )}&reports=${encodeURIComponent(reports)}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle add field to general daily report
 * @param {*} field
 * @returns void
 */
export function HandleAddFieldToGeneralDailyReport(field) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addFieldToGeneralDailyReport?field=${encodeURIComponent(
      field
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

/**
 * Handle get fields general daily report
 * @returns {Promise(Array || string)} Success - array, Failure - string error message
 */
export function handleGetFieldsGeneralDailyReport() {
  const user = localStorage.getItem("username");
  return fetch(
    `api/getFieldsGeneralDailyReport?user=${encodeURIComponent(user)}`
  );
}

/**
 * Handle remove field to general daily report
 * @param {*} field
 * @returns void
 */
export function HandleRemoveFieldToGeneralDailyReport(field) {
  const user = localStorage.getItem("username");
  return fetch(
    `api/removeFieldToGeneralDailyReport?field=${encodeURIComponent(
      field
    )}&user=${encodeURIComponent(user)}`
  );
}

export function HandleGetFullDailyReport(date, user) {
  console.log(date);
  return fetch(
    `/api/getFullDailyReport?date=${encodeURIComponent(
      date
    )}&user=${encodeURIComponent(user)}`
  );
}
