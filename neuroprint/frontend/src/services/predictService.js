import apiClient from "./apiClient";

export const fetchRiskPrediction = async () => {
  const { data } = await apiClient.get("/predict/risk");
  return data;
};
