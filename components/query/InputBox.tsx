import styles from './styles.module.scss';

type InputBoxProps = {
  onChange: (value: string) => void;
  value: string;
  onSearch: () => void;
};

const InputBox = ({ value, onChange, onSearch }: InputBoxProps) => {
  return (
    <div>
      <input type="text" placeholder="Search" className={styles.search} value={value} onChange={(e) => { onChange(e.target.value); }} />
      <button className={styles.button} type="button" onClick={onSearch}>Submit</button>
    </div>
  );
};

export default InputBox;
