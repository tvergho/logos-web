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
  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const color = ['yellow', 'lime', 'aqua'].includes(highlightColor) ? highlightColor : 'yellow';
  // Sweep span boundaries to render disjoint segments, including crossing spans.
  // Counts handle overlapping spans of the same kind without switching off early.
  const events = new Map<number, number[]>();
  const event = (position: number) => {
    const existing = events.get(position);
    if (existing) return existing;
    const deltas = [0, 0, 0];
    events.set(position, deltas);
    return deltas;
  };
  event(0);
  event(paragraph.length);
  [card.highlights, card.underlines, card.emphasis].forEach((spans, kind) => {
    (spans || []).forEach(([line, start, end]) => {
      if (line !== i + 2 || !Number.isInteger(start) || !Number.isInteger(end)
        || start < 0 || end > paragraph.length || start >= end) return;
      event(start)[kind] += 1;
      event(end)[kind] -= 1;
    });
  });
  const positions = Array.from(events.keys()).sort((a, b) => a - b);
  const active = [0, 0, 0];
  const segments: string[] = [];
  positions.slice(0, -1).forEach((start, index) => {
    event(start).forEach((delta, kind) => { active[kind] += delta; });
    const style = [active[0] > 0 ? `background-color:${color}` : '',
      active[1] > 0 ? 'text-decoration:underline' : '',
      active[2] > 0 ? 'font-weight:bold' : ''].filter(Boolean).join(';');
    const text = escape(paragraph.slice(start, positions[index + 1]));
    segments.push(style ? `<span style="${style}">${text}</span>` : text);
  });
  return `<span style="white-space:pre-wrap">${segments.join('')}</span>`;
};

export const getRedirectUriFromHeaders = (headers: IncomingHttpHeaders) => {
  const redirectUriSuffix = 'auth-redirect';
  return `${headers['x-forwarded-proto'] ? 'https://' : 'http://'}${headers.host}/${redirectUriSuffix}`;
};
