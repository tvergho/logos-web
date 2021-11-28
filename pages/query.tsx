import { useState, useEffect } from 'react';
import { InputBox, SearchResults, CardDetail } from '../components/query';
import * as apiService from '../services/api';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cards, setCards] = useState<Record<string, any>>({});
  const [selectedCard, setSelectedCard] = useState(undefined);

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
      <div className="query-body">
        <SearchResults results={results} setSelected={(id) => setSelectedCard(cards[id])} />
        <CardDetail card={selectedCard} />
      </div>
    </div>
  );
};

export default QueryPage;
