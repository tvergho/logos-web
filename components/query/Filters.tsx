import { useEffect } from 'react';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import styles from './styles.module.scss';

type FiltersProps = {
  selectionRange: {
    startDate: Date,
    endDate: Date,
    key: string,
  },
  handleSelect: (ranges: RangeKeyDict) => void,
  resetDate: () => void,
}

const Filters = ({
  selectionRange, handleSelect, resetDate,
}: FiltersProps) => {
  const toggleCalendar = (e?: MouseEvent, off?: boolean) => {
    const elements = document.getElementsByClassName('rdrMonthsVertical') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].style.visibility = (elements[i].style.visibility === 'visible' || off) ? 'hidden' : 'visible';
    }

    const elements2 = document.getElementsByClassName('rdrMonthAndYearWrapper') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements2.length; i += 1) {
      elements2[i].style.visibility = (elements2[i].style.visibility === 'visible' || off) ? 'hidden' : 'visible';
    }

    const elements3 = document.getElementsByClassName('rdrCalendarWrapper') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements3.length; i += 1) {
      elements3[i].style.background = (elements3[i].style.background === '' || off) ? 'transparent' : '';
    }
  };

  useEffect(() => {
    toggleCalendar(undefined, true);
    const elements = document.getElementsByClassName('rdrDateDisplayItem') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].addEventListener('click', toggleCalendar);
    }

    const elements2 = document.getElementsByClassName('rdrDefinedRangesWrapper') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements2.length; i += 1) {
      elements2[i].style.display = 'none';
    }
  }, []);

  return (
    <div className={styles.filters}>
      <div className={`${styles.filter} ${styles['range-container']}`}>
        <div className={styles['filter-row']}>
          <h6 className={styles.range}>DATE</h6>
          <button type="button" onClick={resetDate} className={styles.clear}>clear</button>
        </div>
        <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
          staticRanges={[]}
          inputRanges={[]}
          maxDate={new Date()}
          minDate={new Date('01-01-1900')}
        />
      </div>
      <div className={styles.filter}>
        <h6>SIDE</h6>
      </div>
    </div>
  );
};

export default Filters;
