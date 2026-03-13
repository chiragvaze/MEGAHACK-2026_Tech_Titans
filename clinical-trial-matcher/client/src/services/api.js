import axios from "axios";

const AUTH_TOKEN_KEY = "ctm_auth_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000
});

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function fetchTrialMatches() {
  const { data } = await api.get("/matching/trials");
  return data;
}

export async function createPatient(payload) {
  const { data } = await api.post("/patient/create", payload);
  return data;
}

export async function uploadPatientFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/patient/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

export async function fetchPatientById(id) {
  const { data } = await api.get(`/patient/${id}`);
  return data;
}

export async function createTrial(payload) {
  const { data } = await api.post("/trial/create", payload);
  return data;
}

export async function fetchAllTrials(filters = {}) {
  const { data } = await api.get("/trial/all", { params: filters });
  return data;
}

export async function fetchTrialById(id) {
  const { data } = await api.get(`/trial/${id}`);
  return data;
}

export async function importTrialJsonFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/trial/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

export async function fetchRecommendations(payload) {
  const { data } = await api.post("/match/recommendations", payload);
  return data;
}

export async function fetchMatchExplanation(payload) {
  const { data } = await api.post("/ai/explain-match", payload);
  return data;
}

export async function fetchChatExplanation(payload) {
  const { data } = await api.post("/chat/explain", payload);
  return data;
}

export default api;
