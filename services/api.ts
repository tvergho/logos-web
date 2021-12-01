import axios from 'axios';

const apiUrl = 'http://localhost:5000';

export const search = async (query: string, cursor = 0) => {
  const response = await axios.get(`${apiUrl}/query?search=${query}&cursor=${cursor}`);
  return { results: response.data.results, cursor: response.data.cursor };
};

export const getCard = async (id: string) => {
  const response = await axios.get(`${apiUrl}/card?id=${id}`);
  return response.data;
};
