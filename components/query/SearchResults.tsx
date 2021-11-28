import type { SearchResult } from '../../lib/types';
import styles from './styles.module.scss';

type SearchResultsProps = {
  results: Array<SearchResult>;
  setSelected: (id: string) => void;
};

const SearchResults = ({ results, setSelected }: SearchResultsProps) => {
  return (
    <div className={styles.results}>
      {results.map((result) => (
        <div key={result.id} className={styles.result} role="button" tabIndex={0} onClick={() => setSelected(result.id)}>
          <div className={styles.tag}>{result.tag}</div>
          <div className={styles.cite}>{result.cite}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
