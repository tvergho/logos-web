/* eslint-disable @typescript-eslint/no-var-requires */
import type { SearchResult } from '../../lib/types';
import DownloadLink from '../DownloadLink';
import styles from './styles.module.scss';

const stringSimilarity = require('string-similarity');

type SearchResultsProps = {
  results: Array<SearchResult>;
  setSelected: (id: string) => void;
};

const SearchResults = ({ results, setSelected }: SearchResultsProps) => {
  const filteredResults = results.reduce<Array<SearchResult>>((acc, result) => {
    const hasSimilarMatch = !!acc.find((r) => { return stringSimilarity.compareTwoStrings(r.tag, result.tag) > 0.8; });
    if (!hasSimilarMatch) {
      return [...acc, result];
    }
    return acc;
  }, []);

  return (
    <div className={styles.results}>
      {filteredResults.map((result) => (
        <div key={result.id} className={styles.result} role="button" tabIndex={0} onClick={() => setSelected(result.id)}>
          <div className={styles.tag}>{result.tag}</div>
          <div className={styles.cite}>{result.cite}</div>
          <DownloadLink url={result.s3_url || result.download_url} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
