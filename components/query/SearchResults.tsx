/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState, useRef } from 'react';
import {
  InfiniteLoader, AutoSizer, List, CellMeasurerCache, ListRowRenderer, CellMeasurer,
} from 'react-virtualized';
import type { SearchResult } from '../../lib/types';
import { generateStyledCite } from '../../lib/utils';
import DownloadLink from '../DownloadLink';
import styles from './styles.module.scss';

const stringSimilarity = require('string-similarity');

type SearchResultsProps = {
  results: Array<SearchResult>;
  setSelected: (id: string) => void;
  cards: Record<string, any>;
  getCard: (id: string) => void;
  loadMore: () => Promise<any>;
};

const SearchResults = ({
  results, setSelected, cards, getCard, loadMore,
}: SearchResultsProps) => {
  const cache = useRef(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  }));
  const [requested, setRequested] = useState<Record<string, any>>({});
  const filteredResults = results.reduce<Array<SearchResult>>((acc, result) => {
    const hasSimilarMatch = !!acc.find((r) => { return stringSimilarity.compareTwoStrings(`${r.tag} ${r.cite}`, `${result.tag} ${result.cite}`) > 0.8; });
    if (!hasSimilarMatch) {
      return [...acc, result];
    }
    return acc;
  }, []);

  const rowRenderer: ListRowRenderer = ({
    index, parent, key, style,
  }) => {
    const result = filteredResults[index];

    if (!cards[result.id] && !/\d/.test(result.cite) && !requested[result.id]) {
      getCard(result.id);
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
      <InfiniteLoader isRowLoaded={(i) => !!filteredResults[i.index]} loadMoreRows={loadMore} rowCount={10000000}>
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
