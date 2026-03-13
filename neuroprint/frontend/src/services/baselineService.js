import apiClient from "./apiClient";

export const createBaselineProfile = async (payload) => {
  const { data } = await apiClient.post("/baseline/create", payload);
  return data;
};
