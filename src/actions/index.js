import axios from "axios";
import cookie from "react-cookies";
import { logoutUser } from "./auth";
import { STATIC_ERROR, FETCH_USER, SEND_CONTACT_FORM } from "./types";
export const CLIENT_ROOT_URL = process.env.REACT_APP_API_HOST;
export const API_URL = process.env.REACT_APP_API_HOST;
//= ===============================
// Utility actions
//= ===============================

export function fetchUser(uid) {
  return function (dispatch) {
    axios
      .get(`${API_URL}/user/${uid}`, {
        headers: { Authorization: cookie.load("token") },
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function updateUserProfile(data) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/user`, {
        headers: { Authorization: cookie.load("token") },
        data
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function errorHandler(dispatch, error, type) {
  console.log("Error type: ", type);
  console.log(error);

  if (!error) return;
  let errorMessage = error.status ? error.data.error : error;

  // NOT AUTHENTICATED ERROR
  if (
    error.status === 401 ||
    (error.response && error.response.status === 401)
  ) {
    errorMessage = "You are not authorized to do this.";
    return dispatch(logoutUser(errorMessage));
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .post(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .get(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Put Request
export function putData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .put(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .delete(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

//= ===============================
// Static Page actions
//= ===============================
export function sendContactForm({ name, emailAddress, message }) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/communication/contact`, { name, emailAddress, message })
      .then((response) => {
        dispatch({
          type: SEND_CONTACT_FORM,
          payload: response.data.message,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, STATIC_ERROR);
      });
  };
}