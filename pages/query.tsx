import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  InputBox, SearchResults, CardDetail, Filters,
} from '../components/query';
import * as apiService from '../services/api';
import { SearchResult } from '../lib/types';

const QueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<SearchResult>>([]);
  const [cards, setCards] = useState<Record<string, any>>({});
  const [selectedCard, setSelectedCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollCursor, setScrollCursor] = useState(0);
  const router = useRouter();
  const { query: { search: urlSearch } } = router;

  const onSearch = async () => {
    router.push({
      pathname: '/query',
      query: {
        search: encodeURI(query),
      },
    });
  };

  const searchRequest = (query: string, c: number, replaceResults = false) => {
    if (!loading) {
      setLoading(true);

      apiService.search(query, c).then((response) => {
        const { results: responseResults, cursor } = response;

        if (replaceResults) setResults(responseResults);
        else setResults((prevResults) => { return [...prevResults, ...responseResults]; });

        setLoading(false);
        setScrollCursor(cursor);
      });
    }
  };

  const loadMore = async () => {
    if (urlSearch && urlSearch.length > 0) {
      searchRequest(decodeURI(urlSearch as string), scrollCursor);
    }
  };

  useEffect(() => {
    if (urlSearch && urlSearch.length > 0) {
      setQuery(decodeURI(urlSearch as string));
      searchRequest(decodeURI(urlSearch as string), 0, true);
    }
  }, [urlSearch]);

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
        <InputBox value={query} onChange={setQuery} onSearch={onSearch} loading={loading} />
        <Filters />
      </div>

      <div className="page-row">
        <SearchResults
          results={results}
          setSelected={setSelectedCard}
          cards={cards}
          getCard={getCard}
          loadMore={loadMore}
        />
        <CardDetail card={cards[selectedCard]} />
      </div>
    </div>
  );
};

export default QueryPage;
