import { useEffect, useState } from 'react';

const fonts = [
  'Calibri',
  'Georgia',
  'Arial',
  'Helvetica',
  'Times New Roman',
];

const FontSelect = () => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  useEffect(() => {
    document.body.style.fontFamily = `${selectedFont}, sans-serif`;
  }, [selectedFont]);

  return (
    <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
      {fonts.map((font) => (
        <option value={font} key={font}>{font}</option>
      ))}
    </select>
  );
};

export default FontSelect;
