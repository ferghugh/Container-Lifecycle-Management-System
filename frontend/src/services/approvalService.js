import api from "./api";
// Approval service that provides functions to fetch and review pending approvals from the backend.
export const getPendingApprovals = async () => {
  const response = await api.get("/approvals");
  return response.data;
};
export const reviewApproval = async (id, approved, comments = "") => {
  const response = await api.put(`/approvals/${id}/review`, {
    approved,
    comments,
  });

  return response.data;
};
