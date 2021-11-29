/* eslint-disable react/no-danger */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from 'react';
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
};

const SearchResults = ({
  results, setSelected, cards, getCard,
}: SearchResultsProps) => {
  const [requested, setRequested] = useState<Record<string, any>>({});
  const filteredResults = results.reduce<Array<SearchResult>>((acc, result) => {
    const hasSimilarMatch = !!acc.find((r) => { return stringSimilarity.compareTwoStrings(r.tag, result.tag) > 0.8; });
    if (!hasSimilarMatch) {
      return [...acc, result];
    }
    return acc;
  }, []);

  return (
    <div className={styles.results}>
      {filteredResults.map((result) => {
        if (!cards[result.id] && !/\d/.test(result.cite) && !requested[result.id]) {
          getCard(result.id);
          setRequested((prev) => ({ ...prev, [result.id]: true }));
        }

        const card = cards[result.id];

        return (
          <div key={result.id} className={styles.result} role="button" tabIndex={0} onClick={() => setSelected(result.id)}>
            <div className={styles.tag}>{/\d/.test(result.cite) ? result.tag : `${result.tag} ${result.cite}`}</div>
            <div className={styles.cite}
              dangerouslySetInnerHTML={{
                __html: (/\d/.test(result.cite) ? generateStyledCite(result.cite, result.cite_emphasis, 11)
                  : (card ? card.body.find((p: string) => /\d/.test(p)) : '')),
              }}
            />
            <DownloadLink url={result.s3_url || result.download_url} />
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
