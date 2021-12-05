/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, useContext } from 'react';
import { highlightColors } from '../lib/constants';
import { AppContext } from '../lib/appContext';
import styles from './styles.module.scss';

const fonts = [
  'Calibri',
  'Georgia',
  'Arial',
  'Helvetica',
  'Times New Roman',
];

const FontSelect = () => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const { highlightColor, setHighlightColor } = useContext(AppContext);

  useEffect(() => {
    document.body.style.fontFamily = `${selectedFont}, sans-serif`;
  }, [selectedFont]);

  return (
    <div className={styles.row}>
      <div className={styles['highlight-select']}>
        {highlightColors.map((color) => {
          return (
            <div
              className={styles.square}
              style={{ backgroundColor: color, border: highlightColor === color ? '1px solid rgba(0,0,0,0.5)' : '' }}
              key={color}
              onClick={() => setHighlightColor(color)}
              role="button"
              tabIndex={0}
            />
          );
        })}
      </div>
      <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className={styles['font-select']}>
        {fonts.map((font) => (
          <option value={font} key={font}>{font}</option>
        ))}
      </select>
    </div>
  );
};

export default FontSelect;
