import { useState, useEffect } from 'react';
import Head from 'next/head';
import { RangeKeyDict } from 'react-date-range';
import { useRouter } from 'next/router';
import { OnChangeValue, MultiValue } from 'react-select';
import { format } from 'date-fns';
import {
  InputBox, SearchResults, CardDetail, Filters,
} from '../components/query';
import * as apiService from '../services/api';
import { SearchResult } from '../lib/types';
import { sideOptions, SideOption } from '../lib/constants';

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
      search: urlSearch, start_date, end_date, exclude_sides,
    },
  } = router;
  const [sides, setSides] = useState<MultiValue<SideOption>>([sideOptions[0], sideOptions[1]]);

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
            search: encodeURI(urlSearch as string),
            start_date: format((ranges.selection.startDate as Date), 'yyyy-MM-dd'),
            end_date: format((ranges.selection.endDate as Date), 'yyyy-MM-dd'),
            ...(exclude_sides) && { exclude_sides },
          },
        });
      } else {
        const start = ranges.selection.startDate || (start_date ? new Date(start_date as string) : new Date());
        const end = ranges.selection.endDate || (end_date ? new Date(end_date as string) : new Date());
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
    if (query && query.length > 0) {
      router.push({
        pathname: '/query',
        query: {
          search: encodeURI(query),
          ...(start_date) && { start_date: encodeURI(start_date as string) },
          ...(end_date) && { end_date: encodeURI(end_date as string) },
          ...(exclude_sides) && { end_date: encodeURI(exclude_sides as string) },
        },
      });
    }
  };

  const searchRequest = (query: string, c: number, replaceResults = false) => {
    if (!loading) {
      setLoading(true);

      apiService.search(query, c, {
        ...(start_date) && { start_date },
        ...(end_date) && { end_date },
        ...(exclude_sides) && { exclude_sides },
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
    if (urlSearch && urlSearch.length > 0) {
      setQuery(decodeURI(urlSearch as string));
      searchRequest(decodeURI(urlSearch as string), 0, true);
    }

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
    }
  }, [urlSearch, start_date, end_date, sides]);

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

  const handleSideSelect = (val: OnChangeValue<SideOption, true>) => {
    setSides(val);
  };

  useEffect(() => {
    if (sides.length === 1) {
      router.push({
        pathname: '/query',
        query: {
          ...(urlSearch) && { search: encodeURI(urlSearch as string) },
          ...(start_date) && { start_date: encodeURI(start_date as string) },
          ...(end_date) && { end_date: encodeURI(end_date as string) },
          exclude_sides: encodeURI(sideOptions.find((opt) => opt.value !== sides[0].value)?.value || ''),
        },
      });
    } else if (sides.length === 2) {
      router.push({
        pathname: '/query',
        query: {
          ...(urlSearch) && { search: encodeURI(urlSearch as string) },
          ...(start_date) && { start_date: encodeURI(start_date as string) },
          ...(end_date) && { end_date: encodeURI(end_date as string) },
        },
      });
    }
  }, [sides, start_date, end_date, urlSearch]);

  return (
    <div className="query-page">
      <Head>
        <title>Logos: A Debate Search Engine</title>
        <meta name="description" content="Search the wiki for cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-row">
        <InputBox value={query} onChange={setQuery} onSearch={onSearch} loading={loading} />
        <Filters selectionRange={selectionRange} handleSelect={handleSelect} sides={sides} selectSide={handleSideSelect} />
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
