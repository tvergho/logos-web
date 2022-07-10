import axios from 'axios';

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://limitless-eyrie-35725.herokuapp.com';

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

export const createUser = async (accessToken: string) => {
  await axios.post(`${apiUrl}/create-user`, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
};
