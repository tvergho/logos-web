import { useState, useEffect } from 'react';
import Head from 'next/head';
import { RangeKeyDict } from 'react-date-range';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
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
  const { query: { search: urlSearch, start_date, end_date } } = router;

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    if (urlSearch) {
      if ((ranges.selection.endDate?.getTime() || 0) - (ranges.selection.startDate?.getTime() || 0) !== 0) {
        router.push({
          pathname: '/query',
          query: {
            search: urlSearch as string,
            start_date: format((ranges.selection.startDate as Date), 'yyyy-MM-dd'),
            end_date: format((ranges.selection.endDate as Date), 'yyyy-MM-dd'),
          },
        });
      } else {
        const start = ranges.selection.startDate as Date;
        const end = ranges.selection.endDate as Date;
        start.setUTCHours(12, 0, 0, 0);
        end.setUTCHours(12, 0, 0, 0);

        setSelectionRange((prev) => {
          return {
            ...prev,
            startDate: start,
            endDate: end,
          };
        });
      }
    }
  };

  const onSearch = async () => {
    router.push({
      pathname: '/query',
      query: {
        search: encodeURI(query),
        ...(start_date) && { start_date: encodeURI(start_date as string) },
        ...(end_date) && { end_date: encodeURI(end_date as string) },
      },
    });
  };

  const searchRequest = (query: string, c: number, replaceResults = false) => {
    if (!loading) {
      setLoading(true);

      apiService.search(query, c, {
        ...(start_date) && { start_date },
        ...(end_date) && { end_date },
      }).then((response) => {
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
    if (start_date && end_date) {
      const start = new Date(start_date as string);
      const end = new Date(end_date as string);
      start.setUTCHours(12, 0, 0, 0);
      end.setUTCHours(12, 0, 0, 0);

      setSelectionRange((prev) => {
        return {
          ...prev,
          startDate: start,
          endDate: end,
        };
      });
      searchRequest(decodeURI(urlSearch as string), 0, true);
    }
  }, [start_date, end_date]);

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
        <Filters selectionRange={selectionRange} handleSelect={handleSelect} />
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
