export type SearchResult = {
  cite: string;
  division?: string;
  id: string;
  s3_url?: string;
  tag: string;
  year?: string;
  download_url?: string | string[];
  cite_emphasis?: [[number, number]];
}

export type Card = {
  id: string;
  tag: string;
  cite: string;
  division?: string;
  s3_url?: string;
  year?: string;
  formatting?: { version: 2; paragraphs: Array<{ text: string; runs: Array<{ text: string; underline: boolean; bold: boolean; highlight: string | null }> }> };
  body: [string],
  emphasis: [[number, number, number]],
  highlights: [[number, number, number]],
  underlines: [[number, number, number]],
  cite_emphasis?: [[number, number]],
  download_url?: string;
  tag_sub?: string;
}
