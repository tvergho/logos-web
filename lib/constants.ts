export const sideOptions = [
  { name: 'Aff', value: 'aff', id: 1 },
  { name: 'Neg', value: 'neg', id: 2 },
];
export type SideOption = typeof sideOptions[number];

export const divisionOptions = [
  { name: 'College', value: 'college', id: 1 },
  { name: 'High School', value: 'high-school', id: 2 },
];
export type DivisionOption = typeof divisionOptions[number];

export const yearOptions = [
  { name: '21-22', id: 1 },
  { name: '20-21', id: 2 },
  { name: '19-20', id: 3 },
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
