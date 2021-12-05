/* eslint-disable jsx-a11y/anchor-is-valid */
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/index.module.scss';

const IndexPage = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const search = () => {
    if (query.trim().length > 0) {
      router.push(`/query?search=${query}`);
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