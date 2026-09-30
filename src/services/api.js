import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const matchScheme = async ({ income, project_cost, category, purpose }) => {
  const response = await api.post('/match-scheme', { income, project_cost, category, purpose });
  return response.data;
};

export const chatWithAI = async ({ user_query, project_cost, annual_income, gender }) => {
  const response = await api.post('/chat', { user_query, project_cost, annual_income, gender });
  return response.data;
};

export const locateBanks = async ({ user_lat, user_lon, radius_km }) => {
  const response = await api.post('/locate-banks', { user_lat, user_lon, radius_km });
  return response.data;
};

export const translateText = async ({ text, source_lang, target_lang }) => {
  const response = await api.post('/translate', { text, source_lang, target_lang });
  return response.data;
};

export default api;
