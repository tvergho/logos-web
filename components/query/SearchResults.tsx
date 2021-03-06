/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  useState, useRef, useEffect, useMemo,
} from 'react';
import {
  InfiniteLoader, AutoSizer, List, CellMeasurerCache, ListRowRenderer, CellMeasurer,
} from 'react-virtualized';
import useWindowSize from '../../lib/useWindowSize';
import type { SearchResult } from '../../lib/types';
import { generateStyledCite } from '../../lib/utils';
import DownloadLink from '../DownloadLink';
import styles from './styles.module.scss';

const stringSimilarity = require('string-similarity');

type SearchResultsProps = {
  results: Array<SearchResult>;
  setSelected: (id: string) => void;
  cards: Record<string, any>;
  getCard: (id: string) => Promise<void>;
  loadMore: () => Promise<any>;
};

const SearchResults = ({
  results, setSelected, cards, getCard, loadMore,
}: SearchResultsProps) => {
  const { width } = useWindowSize();
  const cache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultWidth: width * 0.35, // this is linked to a hardcoded value in the CSS
    defaultHeight: 80,
  }));
  const loader = useRef<InfiniteLoader>(null);
  const [requested, setRequested] = useState<Record<string, any>>({});

  // filter the list by string similarity to avoid showing duplicate cards
  // successive cards with a combined tag + cite similarity of 0.8 or greater compared with any other previous card
  // will not be shown in the final set of search results
  const filteredResults = useMemo<Array<SearchResult>>(() => {
    return results.reduce<Array<SearchResult>>((acc, result) => {
      const hasSimilarMatch = !!acc.find((r) => { return stringSimilarity.compareTwoStrings(`${r.tag} ${r.cite}`, `${result.tag} ${result.cite}`) > 0.95; });
      if (!hasSimilarMatch) {
        return [...acc, result];
      }
      return acc;
    }, []);
  }, [results]);

  useEffect(() => {
    if (loader.current) {
      loader.current.resetLoadMoreRowsCache();
    }
  }, [cards]);

  useEffect(() => {
    loader.current?.resetLoadMoreRowsCache();
    cache.current.clearAll();
  }, [results[0], width]);

  const rowRenderer: ListRowRenderer = ({
    index, parent, key, style,
  }) => {
    const result = filteredResults[index];

    // largely deprecated
    // in previous versions of the app, this would load the first couple lines of the card body early
    // if the tag was cut off early and the cite didn't contain cite info
    if (!cards[result.id] && !/\d/.test(result.cite) && !requested[result.id]) {
      getCard(result.id).then(() => {
        cache.current.clear(index, 0);
      });
      setRequested((prev) => ({ ...prev, [result.id]: true }));
    }

    const card = cards[result.id];

    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div key={result.id} className={styles.result} role="button" tabIndex={0} onClick={() => setSelected(result.id)} style={style}>
          <div className={styles.tag}>{/\d/.test(result.cite) ? result.tag : `${result.tag} ${result.cite}`}</div>
          <div className={styles.cite}
            dangerouslySetInnerHTML={{
              __html: (/\d/.test(result.cite) ? generateStyledCite(result.cite, result.cite_emphasis, 11)
                : (card ? card.body.find((p: string) => /\d/.test(p)) : '')),
            }}
          />
          <DownloadLink url={result.s3_url || result.download_url} />
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className={styles.results}>
      <InfiniteLoader
        isRowLoaded={(i) => !!filteredResults[i.index]}
        loadMoreRows={loadMore}
        rowCount={10000000}
        ref={loader}
        threshold={2}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => (
              <List
                rowCount={filteredResults.length}
                width={width}
                height={height}
                rowHeight={cache.current.rowHeight}
                rowRenderer={rowRenderer}
                deferredMeasurementCache={cache.current}
                overscanRowCount={10}
                onRowsRendered={onRowsRendered}
                ref={(el) => {
                  registerChild(el);
                }}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default SearchResults;
