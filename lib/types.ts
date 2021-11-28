export type SearchResult = {
  cite: string;
  division?: string;
  id: string;
  s3_url?: string;
  tag: string;
  year?: string;
}

export type Card = {
  id: string;
  tag: string;
  cite: string;
  division?: string;
  s3_url?: string;
  year?: string;
  body: [string],
  emphasis: [[number, number, number]],
  highlights: [[number, number, number]],
  underlines: [[number, number, number]]
}
