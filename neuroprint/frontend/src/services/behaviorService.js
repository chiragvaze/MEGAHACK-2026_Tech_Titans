import apiClient from "./apiClient";

export const collectBehaviorFeatures = async (payload) => {
  const { data } = await apiClient.post("/behavior/collect", payload);
  return data;
};

export const fetchBehaviorHistory = async () => {
  const { data } = await apiClient.get("/behavior/history");
  return data;
};

export const clearBehaviorHistory = async () => {
  const { data } = await apiClient.delete("/behavior/history");
  return data;
};
