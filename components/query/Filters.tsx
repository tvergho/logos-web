/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import Multiselect from 'multiselect-react-dropdown';
import { motion } from 'framer-motion';
import styles from './styles.module.scss';
import {
  sideOptions, SideOption, divisionOptions, DivisionOption, yearOptions, YearOption, SchoolOption,
} from '../../lib/constants';
import useWindowSize from '../../lib/useWindowSize';

type FiltersProps = {
  selectionRange: {
    startDate: Date,
    endDate: Date,
    key: string,
  },
  handleSelect: (ranges: RangeKeyDict) => void,
  resetDate: () => void,
  resetSchools: () => void,
  onSideSelect: (selected: SideOption[]) => void,
  urlValues: {[key: string]: any},
  onDivisionSelect: (selected: DivisionOption[]) => void,
  onYearSelect: (selected: YearOption[]) => void,
  onSchoolSelect: (selected: SchoolOption[]) => void,
  schools: SchoolOption[],
  togglePersonal: () => void
}

const Filters = ({
  selectionRange, handleSelect, resetDate, onSideSelect, urlValues, onDivisionSelect, onYearSelect, onSchoolSelect, schools, resetSchools, togglePersonal,
}: FiltersProps) => {
  const [isFiltersShown, setIsFiltersShown] = useState(false);
  const { width } = useWindowSize();

  /**
   * Toggle visibility of the calendar element programatically (since the package doesn't support this functionality natively).
   * On click handler tied to the start and end date inputs.
   */
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
    const elements = document.getElementsByClassName('rdrDateDisplayItem') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].addEventListener('click', toggleCalendar);
    }

    const elements2 = document.getElementsByClassName('rdrDefinedRangesWrapper') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elements2.length; i += 1) {
      elements2[i].style.display = 'none';
    }

    return () => {
      const elements3 = document.getElementsByClassName('rdrDateDisplayItem') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < elements3.length; i += 1) {
        elements3[i].removeEventListener('click', toggleCalendar);
      }
    };
  }, [isFiltersShown]);

  useEffect(() => {
    toggleCalendar(undefined, true);
  }, []);

  return (
    <>
      <button type="button" className={styles['filter-prompt']} onClick={() => setIsFiltersShown((i) => !i)}>toggle filters</button>
      <motion.div className={styles.filters} animate={{ height: isFiltersShown ? (width > 1200 ? 130 : (width < 600 ? 350 : 200)) : 0, overflow: isFiltersShown ? 'visible' : 'hidden' }}>
        <div className={styles.filter}>
          <h6>SIDE</h6>
          <Multiselect
            options={sideOptions}
            displayValue="name"
            selectedValues={urlValues.sides || [sideOptions[0], sideOptions[1]]}
            style={{ multiselectContainer: { width: 200 }, inputField: { width: 50 }, chips: { background: 'rgb(0, 105, 62)' } }}
            hidePlaceholder
            emptyRecordMsg=""
            placeholder=""
            onSelect={onSideSelect}
            onRemove={onSideSelect}
          />
        </div>
        <div className={styles.filter}>
          <h6>DIVISION</h6>
          <Multiselect
            options={divisionOptions}
            displayValue="name"
            selectedValues={urlValues.division || [divisionOptions[0], divisionOptions[1]]}
            style={{ multiselectContainer: { width: 200 }, inputField: { width: 50, height: 28 }, chips: { display: 'none' } }}
            hidePlaceholder
            emptyRecordMsg=""
            placeholder=""
            onSelect={onDivisionSelect}
            onRemove={onDivisionSelect}
            showCheckbox
            showArrow
          />
        </div>
        <div className={styles.filter}>
          <h6>YEAR</h6>
          <Multiselect
            options={yearOptions}
            displayValue="name"
            selectedValues={urlValues.year || [yearOptions[0], yearOptions[1]]}
            style={{ multiselectContainer: { width: 100 }, inputField: { width: 50, height: 28 }, chips: { display: 'none' } }}
            hidePlaceholder
            emptyRecordMsg=""
            placeholder=""
            onSelect={onYearSelect}
            onRemove={onYearSelect}
            showCheckbox
            showArrow
          />
        </div>
        <div className={styles.filter}>
          <div className={styles['filter-row']}>
            <h6>SCHOOLS</h6>
            <button type="button" onClick={resetSchools} className={styles.clear}>{urlValues.schools?.length === schools.length ? 'deselect all' : 'select all'}</button>
          </div>
          <Multiselect
            options={schools}
            displayValue="name"
            selectedValues={urlValues.schools || schools}
            style={{ multiselectContainer: { width: 200 }, inputField: { width: 50, height: 28 }, chips: { display: 'none' } }}
            hidePlaceholder
            emptyRecordMsg=""
            placeholder=""
            onSelect={onSchoolSelect}
            onRemove={onSchoolSelect}
            showCheckbox
            showArrow
          />
        </div>
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
            editableDateInputs
          />
        </div>
      </motion.div>
    </>
  );
};

export default Filters;
