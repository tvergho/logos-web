/* eslint-disable @typescript-eslint/no-namespace */
import { useEffect } from 'react';
import styles from './styles.module.scss';

type InputBoxProps = {
  onChange: (value: string) => void;
  value: string;
  onSearch: () => void;
  loading: boolean;
};

declare global {
  namespace JSX {
      interface IntrinsicElements {
          'dotlottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
          {src?: string, background?: string, width?: string, height?: string, loop?: boolean, autoplay?: boolean, controls?: boolean, style?: React.CSSProperties, speed?: string};
      }
  }
}

const InputBox = ({
  value, onChange, onSearch, loading,
}: InputBoxProps) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  useEffect(() => {
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
