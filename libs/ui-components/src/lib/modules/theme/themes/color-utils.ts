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

  return unsafeCSS(`rgb(${r}, ${g}, ${b} / ${alfa}%)`);
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
