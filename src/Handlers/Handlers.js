export function handleLogin(username, password, onLogin) {
  fetch(
    `/api/login?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`
  )
    .then(response => response.json())
    .then(state => {
      if (state.result === "User Logged in succesfully.") {
        onLogin(username);
      }
      alert(state.result);
    });
}

export function handleLogout(onLogout) {
  const username = localStorage.getItem("username");
  fetch(`/api/logout?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

export function handleRemoveProduct(productName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/removeProduct?productName=${encodeURIComponent(productName)}
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

export function handleAddCategory(categoryName) {
  const user = localStorage.getItem("username");
  fetch(
    `api/addCategory?name=${encodeURIComponent(
      categoryName
    )}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
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
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
}

export function handleGetItemsByDates(startDate, endDate) {
  const user = localStorage.getItem("username");
  fetch(
    `api/getItemsByDates?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}&user=${encodeURIComponent(user)}`
  )
    .then(response => response.json())
    .then(state => {
      alert(state.result);
    });
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

export function handleCafeteriaProducts(username) {
  return fetch(
    `/api/getCafeteriaProducts?user=${encodeURIComponent(username)}`
  );
}
