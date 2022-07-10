import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './styles.module.scss';

const ConnectDropboxButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button className={styles.connect} type="button" onClick={() => { signOut({ redirect: false }); }}>
        <p>Sign out</p>
      </button>
    );
  }

  return (
    <button className={styles.connect} type="button" onClick={() => { signIn('dropbox'); }}>
      <Image src="/dropbox-logo.png" alt="Dropbox" width={24} height={24} />
      <p style={{ marginLeft: 10 }}>Sign in with Dropbox</p>
    </button>
  );
};

export default ConnectDropboxButton;
