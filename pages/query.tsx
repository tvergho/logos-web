import { useState, useEffect } from 'react';
import Head from 'next/head';
import { InputBox, SearchResults, CardDetail } from '../components/query';
import * as apiService from '../services/api';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cards, setCards] = useState<Record<string, any>>({});
  const [selectedCard, setSelectedCard] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (query.length > 0) {
      setLoading(true);
      const response = await apiService.search(query);
      setResults(response);
      setLoading(false);
    }
  };

  const getCard = async (id: string) => {
    if (!cards[id]) {
      const card = await apiService.getCard(id);
      setCards((c) => { return { ...c, [id]: card }; });
    }
  };

  useEffect(() => {
    if (selectedCard) {
      getCard(selectedCard);
    }
  }, [selectedCard]);

  return (
    <div className="query-page">
      <Head>
        <title>Logos: A Debate Search Engine</title>
        <meta name="description" content="Search the wiki for cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-row">
        <InputBox value={query} onChange={setQuery} onSearch={search} loading={loading} />
      </div>

      <div className="page-row">
        <SearchResults results={results} setSelected={setSelectedCard} cards={cards} getCard={getCard} />
        <CardDetail card={cards[selectedCard]} />
      </div>
    </div>
  );
};

export default QueryPage;
