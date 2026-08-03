import api from "./api";
// Analytics service that provides functions to fetch analytics data from the backend.
export async function getAnalytics() {
    const response = await api.get("/dashboard/analytics");
    return response.data;
}