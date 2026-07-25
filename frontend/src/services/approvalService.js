import api from "./api";

export const getPendingApprovals = async () => {
    const response = await api.get("/approvals");
    return response.data;
}
export const reviewApproval = async (id, approved, comments = "") => {
    const response = await api.put(
        `/approvals/${id}/review`,
        {
            approved,
            comments
        }
    );

    return response.data;
};