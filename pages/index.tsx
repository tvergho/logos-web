/* eslint-disable jsx-a11y/anchor-is-valid */
import mixpanel from 'mixpanel-browser';
import { DropboxAuth } from 'dropbox';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ConnectDropboxButton from '../components/dropbox/ConnectDropboxButton';
import styles from '../styles/index.module.scss';

const dropbox = new DropboxAuth({
  clientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID,
});
const redirectUriSuffix = 'auth-redirect';

const IndexPage = ({ dropboxUrl } : {dropboxUrl: string | undefined}) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    mixpanel.track('Page View', {
      page: 'Home',
    });
  }, []);

  const search = () => {
    if (query.trim().length > 0) {
      router.push(`/query?search=${encodeURI(query)}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <>
      <Head>
        <title>Logos: A Debate Search Engine</title>
        <meta name="description" content="Search the wiki for cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <ConnectDropboxButton dropboxUrl={dropboxUrl} />

        <h1 className={styles.logo}>LOGOS</h1>
        <h2 className={styles.subtitle}>a debate search platform</h2>

        <div className={styles.row}>
          <input onKeyDown={onKeyDown} className={styles.search} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className={styles.submit} onClick={search}>Submit</button>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { headers } = context.req;
  const redirectUri = `${headers['x-forwarded-proto'] ? 'https://' : 'http://'}${headers.host}/${redirectUriSuffix}`;

  const dropboxUrl = await dropbox.getAuthenticationUrl(redirectUri, undefined, 'code', 'offline');

  return { props: { dropboxUrl } };
};

export default IndexPage;
