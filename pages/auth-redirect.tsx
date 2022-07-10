import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AuthRedirectPage = () => {
  const router = useRouter();
  const { code } = router.query ?? {};

  useEffect(() => {
    if (!code) {
      router.push('/');
    }
  }, [code]);

  return (
    <Head>
      <title>Logos: A Debate Search Engine</title>
      <meta name="description" content="Search the wiki for cards" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default AuthRedirectPage;
