export const sideOptions = [
  { name: 'Aff', value: 'aff', id: 1 },
  { name: 'Neg', value: 'neg', id: 2 },
];
export type SideOption = typeof sideOptions[number];

export const divisionOptions = [
  { name: 'College', value: 'ndtceda', id: 1 },
  { name: 'High School', value: 'hspolicy', id: 2 },
  // { name: 'Open Evidence', value: 'open-ev', id: 3 },
];
export type DivisionOption = typeof divisionOptions[number];

export const yearOptions = [
  { name: '24', id: 0 },
  { name: '23', id: 1 },
  { name: '22', id: 2 },
  { name: '21', id: 3 },
  { name: '20', id: 4 },
  { name: '19', id: 5 },
  { name: '18', id: 6 },
];
export type YearOption = typeof yearOptions[number];

export type SchoolOption = {
  name: string;
  id: number;
}

export const highlightColors = [
  'yellow',
  'lime',
  'aqua',
];

export const fonts = [
  'Calibri',
  'Georgia',
  'Arial',
  'Helvetica',
  'Times New Roman',
];
