export const generateStyledCite = (cite?: string, cite_emphasis: Array<[number, number]> = []) => {
  if (!cite) return '';
  if (!cite_emphasis) return cite;

  const citeObj: Record<string, string> = {};

  for (const [start, end] of cite_emphasis) {
    citeObj[start] = `${citeObj[start] || ''}<span style="font-size:13pt;font-weight:bold;">`;
    citeObj[end] = `${citeObj[end] || ''}</span>`;
  }

  const styledCite = cite.replace(/(?:)/g, (_, index) => citeObj[index] || '');

  return styledCite;
};
