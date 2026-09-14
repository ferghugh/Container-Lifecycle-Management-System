import api from "./api";
// Container service that provides functions to fetch and manage container data from the backend.

// Fetch all containers from the backend
export const getContainers = async () => {
  const response = await api.get("/containers");
  return response.data;
};
// Fetch a specific container by its ID from the backend
export const getContainerById = async (id) => {
  const response = await api.get(`/containers/${id}`);
  return response.data;
};
// Move a container to the next stage in its lifecycle
export const moveContainer = async (id, movementData) => {
  const response = await api.post(`/containers/${id}/move`, movementData);
  return response.data;
};
// Fetch analytics data related to containers from the backend
export const createContainer = async (container) => {
  const response = await api.post("/containers", container);
  return response.data;
};
// Fetch container details by its unique code
export const getContainerByCode = async (code) => {
  const response = await api.get(`/containers/code/${code}`);
  return response.data;
};
