/* eslint-disable jsx-a11y/anchor-is-valid */
import '../styles/globals.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import type { AppProps } from 'next/app';
import Link from 'next/link';
import FontSelect from '../components/FontSelect';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <div className="logo">
        <Link href="/query" passHref><a><h1>Logos</h1></a></Link>
        <FontSelect />
      </div>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
