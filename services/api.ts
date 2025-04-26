import axios from 'axios';

const oldUrl = 'https://logos-web.onrender.com';
const newUrl = 'https://logos-debate.duckdns.org';
const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : newUrl;

export const search = async (query: string, cursor = 0, additionalParams = {}) => {
  let url = `${apiUrl}/query?search=${query}&cursor=${cursor}`;
  Object.entries(additionalParams).forEach(([key, value]) => {
    url += `&${key}=${value}`;
  });

  const response = await axios.get(url);
  return { results: response.data.results, cursor: response.data.cursor };
};

export const getCard = async (id: string) => {
  const response = await axios.get(`${apiUrl}/card?id=${id}`);
  return response.data;
};

export const getSchools = async () => {
  const response = await axios.get(`${apiUrl}/schools`);
  return response.data;
};

export const createUser = async (accessToken: string, refreshToken: string) => {
  await axios.post(`${apiUrl}/create-user`, { refresh_token: refreshToken }, { headers: { Authorization: `Bearer ${accessToken}` } });
};
