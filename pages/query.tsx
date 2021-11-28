import { useState, useEffect } from 'react';
import { InputBox, SearchResults, CardDetail } from '../components/query';
import FontSelect from '../components/FontSelect';
import * as apiService from '../services/api';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cards, setCards] = useState<Record<string, any>>({});
  const [selectedCard, setSelectedCard] = useState('');

  const search = async () => {
    if (query.length > 0) {
      const response = await apiService.search(query);
      setResults(response);
    }
  };

  const getCard = async (id: string) => {
    const card = await apiService.getCard(id);
    setCards((c) => { return { ...c, [id]: card }; });
  };

  useEffect(() => {
    if (selectedCard) {
      getCard(selectedCard);
    }
  }, [selectedCard]);

  return (
    <div className="query-page">
      <div className="query-body">
        <InputBox value={query} onChange={setQuery} onSearch={search} />
        <FontSelect />
      </div>
      <div className="query-body">
        <SearchResults results={results} setSelected={setSelectedCard} />
        <CardDetail card={cards[selectedCard]} />
      </div>
    </div>
  );
};

export default QueryPage;
