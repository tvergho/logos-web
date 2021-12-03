import { useEffect, useState } from 'react';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import styles from './styles.module.scss';

const Filters = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleSelect = (ranges: RangeKeyDict) => {
    if (ranges.selection.startDate && ranges.selection.endDate) {
      setSelectionRange((prev) => { return { ...prev, startDate: ranges.selection.startDate as Date, endDate: ranges.selection.endDate as Date }; });
    }
  };

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
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        staticRanges={[]}
        inputRanges={[]}
        maxDate={new Date()}
        minDate={new Date('01-01-1900')}
      />
    </div>
  );
};

export default Filters;
