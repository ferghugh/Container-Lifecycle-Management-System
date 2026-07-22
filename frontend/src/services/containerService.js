import api from "./api";

export const getContainers = async () => {
    const response = await api.get("/containers");
    return response.data;
};

export const getContainerById = async (id) => {
    const response = await api.get(`/containers/${id}`);
    return response.data;
};

export const moveContainer = async (id, movementData) => {
    const response = await api.post(`/containers/${id}/move`, movementData);
    return response.data;
};

export const createContainer = async (container) => {
    const response = await api.post("/containers", container);
    return response.data;
};