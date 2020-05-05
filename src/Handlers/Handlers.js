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
    .then((response) => response.json())
    .then((state) => {
      if (state.result === "User Logged in succesfully.") {
        onLogin(username);
      }
      alert(state.result);
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
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddProduct(
  productName,
  productPrice,
  productQuantity,
  maxQuantity,
  minQuantity,
  productCategory
) {
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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleEditProduct(
  productName,
  productPrice,
  productQuantity,
  maxQuantity,
  minQuantity,
  productCategory
) {
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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleRemoveProduct(productName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeProduct?productName=${encodeURIComponent(productName)}
    &user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddMovieOrder(orderDate, supplierName, moviesName) {
  const user = localStorage.getItem("username");
  const orderId = `${user} , ${new Date()}`;
  fetch(
    `api/addMovieOrder?orderId=${encodeURIComponent(orderId)}
    &orderDate=${encodeURIComponent(orderDate)}
    &supplierName=${encodeURIComponent(supplierName)}
    &moviesName=${JSON.stringify(moviesName)}
    &user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddMovie(movieName, category) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addMovie?movieName=${encodeURIComponent(
      movieName
    )}&category=${encodeURIComponent(category)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}
/**
 * Handle remove movie from system
 * @param {string} movieName
 */
export function handleRemoveMovie(movieName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeMovie?movieName=${encodeURIComponent(
      movieName
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddCategory(categoryName, parentName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&parentName=${encodeURIComponent(parentName)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleEditCategory(categoryName, parentName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&parentName=${encodeURIComponent(parentName)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleRemoveCategory(categoryName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeCategory?categoryName=${encodeURIComponent(
      categoryName
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddCafeteriaOrder(productsName, supplierName, orderDate) {
  const productsList = JSON.stringify(productsName);
  const user = localStorage.getItem("username");
  const orderId = `${user} , ${orderDate}`;
  fetch(
    `api/addCafeteriaOrder?orderId=${encodeURIComponent(orderId)}
    &productsList=${productsList}&supplierName=${encodeURIComponent(
      supplierName
    )}&orderDate=${encodeURIComponent(orderDate)}&user=${encodeURIComponent(
      user
    )}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleEditCafeteriaOrder(orderId, orderDate, updatedProducts) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&orderDate=${encodeURIComponent(
      orderDate
    )}&updatedProducts=${encodeURIComponent(
      updatedProducts
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleRemoveOrder(orderId) {
  const user = localStorage.getItem("username");
  fetch(
    `api/RemoveOrder?orderId=${encodeURIComponent(
      orderId
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleGetOrdersByDates(startDate, endDate, isCafeteriaOrder) {
  return fetch(
    `api/getOrdersByDates?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(
      endDate
    )}&isCafeteriaOrder=${encodeURIComponent(isCafeteriaOrder)}`
  );
}

export function handleGetProductsByOrder(username, orderName) {
  return fetch(
    `api/getProductsByOrder?orderName=${encodeURIComponent(
      orderName
    )}&user=${encodeURIComponent(username)}`
  );
}

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

export function handleGetMovies(username) {
  return fetch(`/api/getMovies?user=${encodeURIComponent(username)}`);
}

export function handleGetInventoryProducts(username) {
  return fetch(
    `/api/getInventoryProducts?user=${encodeURIComponent(username)}`
  );
}

export function handleGetCategories(username) {
  return fetch(`/api/getCategories?user=${encodeURIComponent(username)}`);
}

export function handleGetCafeteriaProducts(username) {
  return fetch(
    `/api/getCafeteriaProducts?user=${encodeURIComponent(username)}`
  );
}

export function handleGetCafeteriaOrders() {
  return fetch(`/api/getCafeteriaOrders`);
}

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
 * @returns {Promise(string)} contact details of supplier
 */
export function handleGetEmployeeDetails(employee, user) {
  return fetch(
    `/api/getEmployeeDetails?employee=${encodeURIComponent(
      employee
    )}&user=${encodeURIComponent(user)}`
  );
}

export function handleGetOrderDetails(order) {
  return fetch(`/api/getOrderDetails?order=${encodeURIComponent(order)}`);
}

export function handleGetMovieDetails(movieName, user) {
  return fetch(
    `/api/getMovieDetails?movieName=${encodeURIComponent(
      movieName
    )}&user=${encodeURIComponent(user)}`
  );
}

export function handleGetProductDetails(productName, user) {
  return fetch(
    `/api/getProductDetails?productName=${encodeURIComponent(
      productName
    )}&user=${encodeURIComponent(user)}`
  );
}

export function handleGetCategoryDetails(categoryName, user) {
  return fetch(
    `/api/getCategoryDetails?categoryName=${encodeURIComponent(
      categoryName
    )}&user=${encodeURIComponent(user)}`
  );
}
/**
 * Handle get report types in system
 * @param {string} user
 * @returns {Promise(Array)} array of report types
 */
export function handleGetReportTypes(user) {
  return fetch(`/api/getReportTypes?user=${encodeURIComponent(user)}`);
}

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

export function handleGetMovieOrders() {
  return fetch(`/api/getMovieOrders?`);
}

export function handleGetMovieOrderDetails(order) {
  return fetch(`/api/getMovieOrderDetails?order=${encodeURIComponent(order)}`);
}

//Temporary
export function handleGetInventoryReport() {
  return fetch(`/api/getInventoryReport`);
}

export function handleGetIncomesReport() {
  return fetch(`/api/getIncomesReport`);
}

export function handleGetGeneralReport() {
  return fetch(`/api/getGeneralReport`);
}

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
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}
