import { BASE_URL } from "./const.js";

const getResponseData = (res, errorMessage) => {
  return res.ok ? res.json() : Promise.reject(errorMessage);
};

const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => getResponseData(res, "При регистрации произошла ошибка."));
};

const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })
    .then((res) => getResponseData(res, "При авторизации произошла ошибка."));
};

const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res) => getResponseData(res, "Не удачная проверка токена"));
};

export { register, authorize, checkToken };