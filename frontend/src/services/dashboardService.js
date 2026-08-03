import api from "./api";
// Fetch dashboard summary data
export const getDashboardSummary = async () => {
    
  const response = await api.get("/dashboard");
  return response.data;
};
