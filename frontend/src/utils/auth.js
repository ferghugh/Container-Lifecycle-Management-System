// The auth.js file contains utility functions for managing user authentication in the car rental application.
// It provides functions to get the authentication token, get the user's role, 
// check if the user is authenticated, and log out the user. 
// These functions interact with local storage to store and retrieve authentication information, 
// and they also dispatch a storage event to synchronize authentication state across
//  different tabs of the application.

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const getUsername = () => {
  return localStorage.getItem("username");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  window.dispatchEvent(new Event("storage"));
};
