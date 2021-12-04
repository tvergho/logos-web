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
  const {
    query: {
      search: urlSearch, start_date, end_date,
    },
  } = router;
  const [lastQuery, setLastQuery] = useState({});

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const updateUrl = (params: {[key: string]: string | undefined}, reset?: string[]) => {
    const query: Record<string, string> = {
      ...(params.search || urlSearch) && { search: params.search ? params.search : urlSearch as string },
      ...(params.start_date || start_date) && { start_date: params.start_date ? params.start_date : start_date as string },
      ...(params.end_date || end_date) && { end_date: params.end_date ? params.end_date : end_date as string },
    };
    for (const key of reset || []) {
      delete query[key];
    }
    router.push({
      pathname: '/query',
      query,
    });
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    if (urlSearch) {
      if ((ranges.selection.endDate?.getTime() || 0) - (ranges.selection.startDate?.getTime() || 0) !== 0) {
        updateUrl({
          start_date: format((ranges.selection.startDate as Date), 'yyyy-MM-dd'),
          end_date: format((ranges.selection.endDate as Date), 'yyyy-MM-dd'),
        });
      } else {
        const start = ranges.selection.startDate || (start_date ? new Date(start_date as string) : new Date());
        const end = ranges.selection.endDate || (end_date ? new Date(end_date as string) : new Date());
        start.setUTCHours(12, 0, 0, 0);
        end.setUTCHours(12, 0, 0, 0);

        setDateRange((prev) => {
          return {
            ...prev,
            startDate: start,
            endDate: end,
          };
        });
      }
    }
  };

  const resetDate = () => {
    updateUrl({}, ['start_date', 'end_date']);
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
  };

  const onSearch = async () => {
    if (query && query.length > 0) {
      updateUrl({ search: encodeURI(query) });
    }
  };

  const searchRequest = (query: string, c: number, replaceResults: boolean) => {
    const q = {
      query,
      cursor: c,
      ...(start_date) && { start_date },
      ...(end_date) && { end_date },
    };

    if (!loading || JSON.stringify(q) !== JSON.stringify(lastQuery)) {
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

      setLastQuery(q);
    }
  };

  const loadMore = async () => {
    if (urlSearch && urlSearch.length > 0) {
      searchRequest(decodeURI(urlSearch as string), scrollCursor, false);
    }
  };

  useEffect(() => {
    if (urlSearch && urlSearch.length > 0) {
      setQuery(decodeURI(urlSearch as string));
      searchRequest(decodeURI(urlSearch as string), 0, true);
    }

    if (start_date && end_date) {
      const start = new Date(start_date as string);
      const end = new Date(end_date as string);
      start.setUTCHours(12, 0, 0, 0);
      end.setUTCHours(12, 0, 0, 0);

      setDateRange((prev) => {
        return {
          ...prev,
          startDate: start,
          endDate: end,
        };
      });
    }
  }, [urlSearch, start_date, end_date]);

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
        <Filters selectionRange={dateRange} handleSelect={handleSelect} resetDate={resetDate} />
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
