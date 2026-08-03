import api from "./api";
// Auth service that provides functions for user authentication, 
// including login, logout, and token management.
export async function login(username, password) {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  localStorage.setItem("token", response.data.token);

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
