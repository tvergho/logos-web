/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export const defaultState = {
  highlightColor: 'yellow',
  setHighlightColor: (color: string) => {},
};

export const AppContext = createContext(defaultState);
