import api from "./api";

export async function getAnalytics() {
    const response = await api.get("/dashboard/analytics");
    return response.data;
}