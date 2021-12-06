/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, useContext } from 'react';
import { highlightColors, fonts } from '../lib/constants';
import { AppContext } from '../lib/appContext';
import styles from './styles.module.scss';

/**
 * Allows the user to select a global font and highlighht color for displaying cards.
 */
const StyleSelect = () => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const { highlightColor, setHighlightColor } = useContext(AppContext);

  useEffect(() => {
    document.body.style.fontFamily = `${selectedFont}, sans-serif`;
  }, [selectedFont]);

  // load from local storage on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const color = window.localStorage.getItem('highlightColor');
      if (color) {
        setHighlightColor(color);
      }

      const font = window.localStorage.getItem('selectedFont');
      if (font) {
        setSelectedFont(font);
      }
    }
  }, []);

  const setColor = (color: string) => {
    setHighlightColor(color);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('highlightColor', color);
    }
  };

  const setFont = (font: string) => {
    setSelectedFont(font);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('selectedFont', font);
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles['highlight-select']}>
        {highlightColors.map((color) => {
          return (
            <div
              className={styles.square}
              style={{ backgroundColor: color, border: highlightColor === color ? '1px solid rgba(0,0,0,0.5)' : '' }}
              key={color}
              onClick={() => setColor(color)}
              role="button"
              tabIndex={0}
            />
          );
        })}
      </div>
      <select value={selectedFont} onChange={(e) => setFont(e.target.value)} className={styles['font-select']}>
        {fonts.map((font) => (
          <option value={font} key={font}>{font}</option>
        ))}
      </select>
    </div>
  );
};

export default StyleSelect;
