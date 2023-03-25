/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingHttpHeaders } from 'http';
import type { Card } from './types';

export const generateStyledCite = (cite?: string, cite_emphasis: Array<[number, number]> = [], fontSize = 13) => {
  if (!cite) return '';
  if (!cite_emphasis) return cite;

  const citeObj: Record<string, string> = {};

  for (const [start, end] of cite_emphasis) {
    citeObj[start] = `${citeObj[start] || ''}<span style="font-size:${fontSize}pt;font-weight:bold;">`;
    citeObj[end] = `${citeObj[end] || ''}</span>`;
  }

  const styledCite = cite.replace(/(?:)/g, (_, index) => citeObj[index] || '');

  return styledCite;
};

export const generateStyledParagraph = (card: Card, i: number, paragraph: string, highlightColor = 'yellow') => {
  const highlights = card.highlights.filter((h) => h[0] === i + 2);
  const underlines = card.underlines.filter((u) => u[0] === i + 2);
  const emphases = card.emphasis.filter((u) => u[0] === i + 2);

  const obj: Record<string, string> = {};
  for (const [_, s, e] of highlights) {
    obj[s] = `${obj[s] || ''}<span style="background:${highlightColor};mso-highlight:${highlightColor}">`;
    obj[e] = `${obj[e] || ''}</span>`;
  }
  for (const [_, s, e] of emphases) {
    obj[s] = `${obj[s] || ''}<b><u>`;
    obj[e] = `${obj[e] || ''}</u></b>`;
  }
  for (const [_, s, e] of underlines) {
    obj[s] = `${obj[s] || ''}<u>`;
    obj[e] = `${obj[e] || ''}</u>`;
  }

  const styledParagraph = paragraph.replace(/(?:)/g, (_, index) => obj[index] || '');
  return styledParagraph;
};

export const getRedirectUriFromHeaders = (headers: IncomingHttpHeaders) => {
  const redirectUriSuffix = 'auth-redirect';
  return `${headers['x-forwarded-proto'] ? 'https://' : 'http://'}${headers.host}/${redirectUriSuffix}`;
};
