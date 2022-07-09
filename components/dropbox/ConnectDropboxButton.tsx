import Image from 'next/image';
import styles from './styles.module.scss';

const ConnectDropboxButton = () => {
  return (
    <button className={styles.connect} type="button">
      <Image src="/dropbox-logo.png" alt="Dropbox" width={24} height={24} />
      <p>Sign in with Dropbox</p>
    </button>
  );
};

export default ConnectDropboxButton;
