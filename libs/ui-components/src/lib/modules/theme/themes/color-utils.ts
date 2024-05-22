import { css, CSSResult, unsafeCSS } from 'lit';

export function hexToRGBA(hex: string, alfa = 100): CSSResult {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return unsafeCSS(`rgba(${r}, ${g}, ${b}, ${alfa}%)`);
}

export function transformColor(hex: string): CSSResult {
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  const deltaR = -32;
  const deltaG = -32;
  const deltaB = -32;

  const clamp = (value: number) => Math.max(0, Math.min(255, value));

  r = clamp(r + deltaR);
  g = clamp(g + deltaG);
  b = clamp(b + deltaB);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  return unsafeCSS(`#${toHex(r)}${toHex(g)}${toHex(b)}`)
}

export function getRandomBrightColor() {
  const max = 200;
  const min = 32;

  const colors = [
    Math.floor(Math.random() * (max - min) + min),
    Math.floor(Math.random() * (max - min) + min),
    max
  ];

  colors.sort(() => Math.random() - 0.5);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(colors[0])}${toHex(colors[1])}${toHex(colors[2])}`;
}

export function getColorFromString(str: string): string {
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRgb(hash: number) {
    const max = 200;
    const min = 32;

    const r = (hash & 0xFF) % (max - min) + min;
    const g = ((hash >> 8) & 0xFF) % (max - min) + min;
    const b = ((hash >> 16) & 0xFF) % (max - min) + min;

    return { r, g, b };
  }

  function rgbToHex(r: number, g: number, b: number) {
    const toHex = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  const hash = hashString(str);
  const { r, g, b } = intToRgb(hash);

  return rgbToHex(r, g, b);
}

export function makeColorSchema(primaryColor: string) {
  return css`
      :root {
          --primary: ${unsafeCSS(primaryColor)};
          --primary-50: ${hexToRGBA(primaryColor, 50)};
          --primary-hover: ${transformColor(primaryColor)};
          --secondary: ${unsafeCSS(primaryColor)}1f;
          --secondary-hover: ${unsafeCSS(primaryColor)}3d;
      }
  `
}
