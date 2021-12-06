/* eslint-disable @typescript-eslint/no-namespace */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.scss';

type InputBoxProps = {
  onChange: (value: string) => void;
  onCiteChange: (value: string) => void;
  citeValue: string;
  value: string;
  onSearch: () => void;
  loading: boolean;
  onCiteSearch: (s: string) => void;
};

// provides native JSX support for the dotlottie player element
// avoids annoying typescript warnings
declare global {
  namespace JSX {
      interface IntrinsicElements {
          'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
          {src?: string, background?: string, width?: string, height?: string, loop?: boolean, autoplay?: boolean, controls?: boolean, style?: React.CSSProperties, speed?: string};
      }
  }
}

const InputBox = ({
  value, onChange, onSearch, loading, onCiteSearch, citeValue, onCiteChange,
}: InputBoxProps) => {
  const [isAdvancedSearchShown, setIsAdvancedSearchShown] = useState(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const onCiteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCiteSearch(e.currentTarget.value);
    }
  };

  useEffect(() => {
    // throws errors if not initialized after the page has first loaded
    require('@dotlottie/player-component');
  }, []);

  return (
    <div className={styles['input-container']}>
      <div>
        <input
          type="text"
          placeholder="Search"
          className={styles.search}
          value={value}
          onChange={(e) => { onChange(e.target.value); }}
          onKeyDown={onKeyDown}
        />
        <button className={styles.button} type="button" onClick={onSearch}>Submit</button>
      </div>

      <button className={styles['advanced-button']} type="button" onClick={() => setIsAdvancedSearchShown((i) => !i)}>Advanced Search</button>
      <motion.div className={styles.advanced} animate={{ height: isAdvancedSearchShown ? '100%' : '0px' }}>
        <input placeholder="Search by cite..." className={styles['advanced-cite']} onKeyDown={onCiteKeyDown} value={citeValue} onChange={(e) => onCiteChange(e.target.value)} />
      </motion.div>

      <div className={styles.loading}>
        {loading && typeof window !== 'undefined' && (
          <dotlottie-player
            src="https://assets10.lottiefiles.com/dotlotties/dlf10_ikmyszsb.lottie"
            background="transparent"
            speed="1"
            style={{ width: 'max(30vw,360px)', height: 30 }}
            loop
            autoplay
          />
        )}
      </div>
    </div>
  );
};

export default InputBox;
