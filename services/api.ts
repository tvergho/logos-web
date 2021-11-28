import axios from 'axios';

const apiUrl = 'http://localhost:5000';

export const search = async (query: string) => {
  const response = await axios.get(`${apiUrl}/query?search=${query}`);
  return response.data.results;
};

export const getCard = async (id: string) => {
  const response = await axios.get(`${apiUrl}/card?id=${id}`);
  return response.data;
};
