/* eslint-disable jsx-a11y/anchor-is-valid */
import '../styles/globals.scss';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useMemo, useState } from 'react';
import mixpanel from 'mixpanel-browser';
import type { AppProps } from 'next/app';
import { AppContext, defaultState } from '../lib/appContext';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || '');

function MyApp({ Component, pageProps }: AppProps) {
  const [highlightColor, setHighlightColor] = useState<string>(defaultState.highlightColor);

  const state = useMemo(() => {
    return {
      highlightColor,
      setHighlightColor,
    };
  }, [highlightColor]);

  return (
    <AppContext.Provider value={state}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
