import { BASE_URL } from "./const.js";

class Api {
  constructor(url) {
    this._url = url;
  }

  _getResponseData(res) {
    return res.ok ? res.json() : Promise.reject();
  }

  getCards() {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  sendCard({ name, link }) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this._getResponseData(res));
  }

  deleteCard(cardId) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  getUserInfo() {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  updateUserInfo({ name, about }) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => this._getResponseData(res));
  }

  updateUserAvatar({ avatar }) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => this._getResponseData(res));
  }

  sendLike(cardId) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }


  deleteLike(cardId) {
    const token = localStorage.getItem("token");

    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }
}

export const api = new Api(BASE_URL);