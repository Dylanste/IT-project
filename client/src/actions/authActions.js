// This file contains the logic for how authorisation will work in our app. 
// It uses axios to make HTTPrequests within a certain action and then dispatches them to our reducers

import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken"

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING,
    USER_NOT_LOADING
} from "./types"


export const loginUser = user => dispatch => {
    axios
    .post('/login', user)
      .then(res => {
        const token=res.data;
        console.log(token);
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = token;
        // Set the current user
        dispatch(setCurrentUser(decoded));

        
      })
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.res.data
    })
    );
  };
  export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// User isn't loading
export const setUserNotLoading = () => {
    return {
        type: USER_NOT_LOADING
    };
};
export const logoutUser = () => dispatch => {
    // Remove the token from localstorage
    localStorage.removeItem("jwtToken");
    // Remove the auth header from future requests
    setAuthToken(false);
    // Set the current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};