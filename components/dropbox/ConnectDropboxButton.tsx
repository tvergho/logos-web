import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

const ConnectDropboxButton = ({ dropboxUrl }: {dropboxUrl: string | undefined}) => {
  const router = useRouter();
  return (
    <button className={styles.connect} type="button" onClick={() => { if (dropboxUrl) router.push(dropboxUrl); }}>
      <Image src="/dropbox-logo.png" alt="Dropbox" width={24} height={24} />
      <p>Sign in with Dropbox</p>
    </button>
  );
};

export default ConnectDropboxButton;
