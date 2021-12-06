/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { RangeKeyDict } from 'react-date-range';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Link from 'next/link';
import StyleSelect from '../components/StyleSelect';
import {
  InputBox, SearchResults, CardDetail, Filters,
} from '../components/query';
import * as apiService from '../services/api';
import { SearchResult } from '../lib/types';
import {
  SideOption, sideOptions, divisionOptions, DivisionOption, yearOptions, YearOption, SchoolOption,
} from '../lib/constants';

const QueryPage = () => {
  const [query, setQuery] = useState(''); // current user input in the search box
  const [results, setResults] = useState<Array<SearchResult>>([]); // results returned from the search API
  const [cards, setCards] = useState<Record<string, any>>({}); // map of IDs to currently retrieved cards
  const [selectedCard, setSelectedCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollCursor, setScrollCursor] = useState(0);
  const [schools, setSchools] = useState<Array<SchoolOption>>([]); // list of schoools returned from the API
  const router = useRouter();
  const { query: routerQuery } = router;
  const {
    search: urlSearch, start_date, end_date, exclude_sides, exclude_division, exclude_years, exclude_schools, cite_match,
  } = routerQuery;
  const [lastQuery, setLastQuery] = useState({});

  // set the initial value of the filters based on the URL
  const urlSelectedSides = sideOptions.filter((side) => { return !exclude_sides?.includes(side.name); });
  const urlSelectedDivision = divisionOptions.filter((division) => { return !exclude_division?.includes(division.value); });
  const urlSelectedYears = yearOptions.filter((year) => { return !exclude_years?.includes(year.name); });
  const urlSelectedSchools = schools.filter((school) => { return !exclude_schools?.includes(school.name); });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  /**
   * Load the list of schools from the API on page load.
   */
  useEffect(() => {
    apiService.getSchools().then((schools) => {
      const { colleges } = schools;
      setSchools(colleges.map((college: string, i: number) => ({ name: college, id: i })));
    });
  }, []);

  /**
    * Updates the specified fields or remove them from the URL.
    * Will trigger a new search if the query is different from the last query.
    */
  const updateUrl = (params: {[key: string]: string | undefined}, reset?: string[]) => {
    const query: Record<string, string> = {
      ...(params.search || urlSearch) && { search: params.search ? params.search : urlSearch as string },
      ...(params.start_date || start_date) && { start_date: params.start_date ? params.start_date : start_date as string },
      ...(params.end_date || end_date) && { end_date: params.end_date ? params.end_date : end_date as string },
      ...(params.exclude_sides || exclude_sides) && { exclude_sides: params.exclude_sides ? params.exclude_sides : exclude_sides as string },
      ...(params.exclude_division || exclude_division) && { exclude_division: params.exclude_division ? params.exclude_division : exclude_division as string },
      ...(params.exclude_years || exclude_years) && { exclude_years: params.exclude_years ? params.exclude_years : exclude_years as string },
      ...(params.exclude_schools || exclude_schools) && { exclude_schools: params.exclude_schools ? params.exclude_schools : exclude_schools as string },
      ...(params.cite_match || cite_match) && { cite_match: params.cite_match ? params.cite_match : cite_match as string },
    };
    for (const key of reset || []) {
      delete query[key];
    }
    router.push({
      pathname: '/query',
      query,
    });
  };

  /**
    * Updates the date range and triggers a new search.
    */
  const handleSelect = (ranges: RangeKeyDict) => {
    if (urlSearch) {
      if ((ranges.selection.endDate?.getTime() || 0) - (ranges.selection.startDate?.getTime() || 0) !== 0) {
        updateUrl({
          start_date: format((ranges.selection.startDate as Date), 'yyyy-MM-dd'),
          end_date: format((ranges.selection.endDate as Date), 'yyyy-MM-dd'),
        });
      } else {
        const start = ranges.selection.startDate || (start_date && start_date.length > 2 ? new Date(start_date as string) : new Date());
        const end = ranges.selection.endDate || (end_date && end_date.length > 2 ? new Date(end_date as string) : new Date());
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

  const resetSchools = () => {
    if (urlSelectedSchools.length !== schools.length) {
      updateUrl({}, ['exclude_schools']);
    } else {
      updateUrl({ exclude_schools: schools.map((school) => school.name).join(',') });
    }
  };

  const onSearch = async () => {
    if (query) {
      updateUrl({ search: encodeURI(query.trim()) });
    } else if (query === '') {
      updateUrl({}, ['search']);
    }
  };

  /**
   * Initiates a new search with the current query, date range, and other query parameters from the API.
   * @param query The query to search for.
   * @param c The cursor to use for pagination.
   * @param replaceResults Whether to replace the current results with the new results.
   */
  const searchRequest = (query = '', c = 0, replaceResults = false) => {
    const q = {
      query,
      cursor: c,
      ...(start_date) && { start_date },
      ...(end_date) && { end_date },
      ...(exclude_sides) && { exclude_sides },
      ...(exclude_division) && { exclude_division },
      ...(exclude_years) && { exclude_years },
      ...(exclude_schools) && { exclude_schools },
      ...(cite_match) && { cite_match },
    };

    if (!loading || JSON.stringify(q) !== JSON.stringify(lastQuery)) {
      setLoading(true);
      apiService.search(query, c, {
        ...(start_date) && { start_date },
        ...(end_date) && { end_date },
        ...(exclude_sides) && { exclude_sides },
        ...(exclude_division) && { exclude_division },
        ...(exclude_years) && { exclude_years },
        ...(exclude_schools) && { exclude_schools },
        ...(cite_match) && { cite_match },
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
    if ((urlSearch && urlSearch.length > 0) || cite_match) {
      searchRequest(decodeURI(urlSearch as string || ''), scrollCursor, false);
    }
  };

  // triggered for any changes in the URL
  useEffect(() => {
    // initiates a new search if the query exists
    if ((urlSearch && urlSearch.length > 0) || cite_match) {
      setQuery(decodeURI(urlSearch as string || ''));
      searchRequest(decodeURI(urlSearch as string || ''), 0, true);
    }

    // update the date range based on changes to the URL
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
  }, [routerQuery]);

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

  const onSideSelect = (sides: SideOption[]) => {
    if (sides.length === 1) {
      updateUrl({ exclude_sides: sideOptions.filter((opt) => !sides.find((side) => side.value === opt.value)).map((opt) => opt.name).join('') });
    } else if (sides.length === 2) {
      updateUrl({}, ['exclude_sides']);
    }
  };

  const onDivisionSelect = (divisions: DivisionOption[]) => {
    if (divisions.length === 1) {
      updateUrl({ exclude_division: divisionOptions.filter((opt) => !divisions.find((div) => div.value === opt.value)).map((opt) => opt.value).join('') });
    } else if (divisions.length === 2) {
      updateUrl({}, ['exclude_division']);
    }
  };

  const onYearSelect = (years: YearOption[]) => {
    if (years.length < yearOptions.length) {
      updateUrl({ exclude_years: yearOptions.filter((opt) => !years.find((div) => div.name === opt.name)).map((opt) => opt.name).join(',') });
    } else {
      updateUrl({}, ['exclude_years']);
    }
  };

  const onSchoolSelect = (s: SchoolOption[]) => {
    if (s.length < schools.length) {
      updateUrl({ exclude_schools: schools.filter((opt) => !s.find((school) => school.name === opt.name)).map((opt) => opt.name).join(',') });
    } else {
      updateUrl({}, ['exclude_schools']);
    }
  };

  const onCiteSearch = (citeSearch: string) => {
    if (citeSearch.length > 0) {
      updateUrl({ cite_match: citeSearch });
    }
  };

  return (
    <>
      <Head>
        <title>Logos: A Debate Search Engine</title>
        <meta name="description" content="Search the wiki for cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="logo">
        <Link href="/" passHref><a><h1>Logos</h1></a></Link>
        <StyleSelect />
      </div>
      <div className="query-page">
        <div className="page-row">
          <InputBox value={query} onChange={setQuery} onSearch={onSearch} loading={loading} onCiteSearch={onCiteSearch} />
          <Filters
            selectionRange={dateRange}
            handleSelect={handleSelect}
            resetDate={resetDate}
            onSideSelect={onSideSelect}
            urlValues={{
              sides: urlSelectedSides, division: urlSelectedDivision, year: urlSelectedYears, schools: urlSelectedSchools,
            }}
            onDivisionSelect={onDivisionSelect}
            onYearSelect={onYearSelect}
            onSchoolSelect={onSchoolSelect}
            schools={schools}
            resetSchools={resetSchools}
          />
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
    </>
  );
};

export default QueryPage;
