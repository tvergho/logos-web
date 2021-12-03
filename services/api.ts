import axios from 'axios';

const apiUrl = 'http://localhost:5000';

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
