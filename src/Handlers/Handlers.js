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
      if (state.result === "Logout succeded.") {
        onLogout();
      }
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
