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
  if (card.formatting?.version === 2) {
    const source = card.formatting.paragraphs[i];
    const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    // Never interpret source text as markup or infer underline from bold/emphasis.
    if (!source || source.text !== paragraph || source.runs.map((r) => r.text).join('') !== paragraph) {
      return `<span style="white-space:pre-wrap">${escape(paragraph)}</span>`;
    }
    const colors: Record<string, string> = {
      black: '#000000', blue: '#0000ff', cyan: '#00ffff', green: '#00ff00',
      magenta: '#ff00ff', red: '#ff0000', yellow: '#ffff00', white: '#ffffff',
      darkBlue: '#000080', darkCyan: '#008080', darkGreen: '#008000',
      darkMagenta: '#800080', darkRed: '#800000', darkYellow: '#808000',
      darkGray: '#808080', lightGray: '#c0c0c0',
    };
    return `<span style="white-space:pre-wrap">${source.runs.map((run) => {
      const style = [run.underline ? 'text-decoration:underline' : '', run.bold ? 'font-weight:bold' : '',
        run.highlight && colors[run.highlight] ? `background-color:${['yellow', 'lime', 'aqua'].includes(highlightColor) ? highlightColor : colors[run.highlight]}` : ''].filter(Boolean).join(';');
      return `<span style="${style}">${escape(run.text)}</span>`;
    }).join('')}</span>`;
  }
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
