import { useState, useEffect } from 'react';
import { InputBox } from '../components/query';
import * as apiService from '../services/api';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cards, setCards] = useState({});

  const search = async () => {
    if (query.length > 0) {
      const response = await apiService.search(query);
      setResults(response);
    }
  };

  const getCards = async () => {
    await Promise.all(results.map(async (result) => {
      const { id } = result;
      const card = await apiService.getCard(id);
      setCards((c) => { return { ...c, [id]: card }; });
    }));
  };

  useEffect(() => {
    getCards();
  }, [results]);

  return (
    <div className="query-page">
      <InputBox value={query} onChange={setQuery} onSearch={search} />
    </div>
  );
};

export default QueryPage;
