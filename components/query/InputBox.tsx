import styles from './styles.module.scss';

const InputBox = () => {
  return (
    <div>
      <input type="text" placeholder="Search" className={styles.search} />
      <button className={styles.button} type="button">Submit</button>
    </div>
  );
};

export default InputBox;
