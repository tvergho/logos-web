/* eslint-disable jsx-a11y/anchor-is-valid */
import mixpanel from 'mixpanel-browser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/index.module.scss';

const IndexPage = () => {
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
        <h1 className={styles.logo}>LOGOS</h1>
        {/* <h2 className={styles.subtitle}>The platform has been disabled for the moment for maintenance and upgrades. We hope to be back soon!</h2> */}
        <h2 className={styles.subtitle}>a debate search platform</h2>

        <div className={styles.row}>
          <input onKeyDown={onKeyDown} className={styles.search} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className={styles.submit} onClick={search}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
