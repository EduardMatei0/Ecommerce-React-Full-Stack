import { API } from "../config";

// read user profile
export const readUser = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// update user profile
export const updateUser = (userId, token, user) => {
  return fetch(`${API}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .catch(error => console.log(error));
};

// update user on local storage
export const updateUserLocalStorage = (user, next) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};

// get purchase History
export const getPurchaseHistory = (userId, token) => {
  return fetch(`${API}/orders/by/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .catch(error => console.log(error));
};
