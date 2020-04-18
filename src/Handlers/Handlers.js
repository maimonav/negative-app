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

export function handleLogout(onLogout) {
  const username = localStorage.getItem("username");
  fetch(`/api/logout?username=${encodeURIComponent(username)}`)
    .then((response) => response.json())
    .then((state) => {
      onLogout();
      alert(state.result);
    });
}

export function handleRegister(username, password) {
  fetch(
    `/api/register?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

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
    `api/EditProduct?productName=${encodeURIComponent(
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
    )}&user=${encodeURIComponent(user)}`
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
    &moviesName=${encodeURIComponent(moviesName)}
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
    `api/addCategory?name=${encodeURIComponent(
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
    `api/editCategory?name=${encodeURIComponent(
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
    `api/removeCategory?name=${encodeURIComponent(
      categoryName
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleAddCafeteriaOrder(productsName, supplierName, orderDate) {
  const user = localStorage.getItem("username");
  const orderId = `${user} , ${new Date()}`;
  fetch(
    `api/addCafeteriaOrder?orderId=${encodeURIComponent(orderId)}
    &productsName=${encodeURIComponent(
      productsName
    )}&supplierName=${encodeURIComponent(
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

export function handleEditCafeteriaOrder(
  orderId,
  productsWithQuantity,
  orderDate,
  updatedProducts
) {
  const user = localStorage.getItem("username");
  fetch(
    `api/editCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&productsWithQuantity=${encodeURIComponent(
      productsWithQuantity
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

export function handleRemoveCafeteriaOrder(orderId) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleConfirmCafeteriaOrder(
  productsName,
  orderId,
  updatedProductsAndQuantity,
  productQuantity
) {
  const user = localStorage.getItem("username");
  fetch(
    `api/confirmCafeteriaOrder?orderId=${encodeURIComponent(
      orderId
    )}&productsName=${encodeURIComponent(
      productsName
    )}&updatedProductsAndQuantity=${encodeURIComponent(
      updatedProductsAndQuantity
    )}&user=${encodeURIComponent(user)}`
  )
    .then((response) => response.json())
    .then((state) => {
      alert(state.result);
    });
}

export function handleGetItemsByDates(userName, startDate, endDate) {
  return fetch(
    `api/getItemsByDates?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&user=${encodeURIComponent(
      userName
    )}`
  );
}

export function handleGetProductsByOrder(username, orderName) {
  return fetch(
    `api/getProductsByOrder?orderName=${encodeURIComponent(
      orderName
    )}&user=${encodeURIComponent(username)}`
  );
}

export function handleGetProductsAndQuantityByOrder(username, orderName) {
  return fetch(
    `api/getProductAndQuntityByOrder?orderName=${encodeURIComponent(
      orderName
    )}&user=${encodeURIComponent(username)}`
  );
}

export function handleGetSuppliers(username) {
  return fetch(`/api/getSuppliers?user=${encodeURIComponent(username)}`);
}

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

export function handleGetCafeteriaOrders(username) {
  return fetch(`/api/getCafeteriaOrders?user=${encodeURIComponent(username)}`);
}

export function handleGetSupplierDetails(supplier, user) {
  return fetch(
    `/api/getSupplierDetails?supplier=${encodeURIComponent(
      supplier
    )}&user=${encodeURIComponent(user)}`
  );
}

export function handleGetEmployeeDetails(employee, user) {
  return fetch(
    `/api/getEmployeeDetails?employee=${encodeURIComponent(
      employee
    )}&user=${encodeURIComponent(user)}`
  );
}

export function handleGetOrderDetails(order, user) {
  return fetch(
    `/api/getOrderDetails?order=${encodeURIComponent(
      order
    )}&user=${encodeURIComponent(user)}`
  );
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

export function handleIsLoggedIn(username) {
  return fetch(`/api/isLoggedIn?username=${encodeURIComponent(username)}`);
}
