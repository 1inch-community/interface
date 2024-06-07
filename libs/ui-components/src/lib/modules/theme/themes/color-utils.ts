import { css, CSSResult, unsafeCSS } from 'lit';

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const rainbowColors = [
  '#FF0000',
  '#FF7F00',
  '#ffd500',
  '#40ff00',
  '#0000FF',
  '#37009e',
  '#8B00FF'
]
export const rainbowRandomColors = shuffleArray(rainbowColors)
const _rainbowRandomColorsInterpolate = interpolateColorArray(rainbowColors, rainbowColors.length / 2)
export const rainbowRandomColorsInterpolate = [..._rainbowRandomColorsInterpolate, ..._rainbowRandomColorsInterpolate.reverse()]

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolate(start: number, end: number, fraction: number) {
  return Math.round(start + (end - start) * fraction);
}

function interpolateColors(color1: string, color2: string, steps: number) {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const colors = [];

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const r = interpolate(r1, r2, fraction);
    const g = interpolate(g1, g2, fraction);
    const b = interpolate(b1, b2, fraction);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
}

function interpolateColorArray(colors: string[], steps: number) {
  const result = [];

  for (let i = 0; i < colors.length - 1; i++) {
    const interpolatedColors = interpolateColors(colors[i], colors[i + 1], steps);
    result.push(...interpolatedColors.slice(0, -1));
  }
  result.push(colors[colors.length - 1]);

  return result;
}

export function interpolateColorRange(startColorHex: string, endColorHex: string, rangeMin: number, rangeMax: number, value: number) {
  const startColorRgb = hexToRgb(startColorHex);
  const endColorHexRgb = hexToRgb(endColorHex);
  const factor = (value - rangeMin) / (rangeMax - rangeMin);
  const r = interpolate(startColorRgb[0], endColorHexRgb[0], factor);
  const g = interpolate(startColorRgb[1], endColorHexRgb[1], factor);
  const b = interpolate(startColorRgb[2], endColorHexRgb[2], factor);
  return rgbToHex(r, g, b);
}

export function hexToRGBA(hex: string, alfa = 100): CSSResult {
  const [ r, g, b ] = hexToRgb(hex)
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

  return unsafeCSS(rgbToHex(r, g ,b))
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

  return rgbToHex(colors[0], colors[1], colors[2]);
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

  const hash = hashString(str);
  const { r, g, b } = intToRgb(hash);

  return rgbToHex(r, g, b);
}

export function applyColorBrightness(hex: string, brightness: number) {
  let [r, g, b] = hexToRgb(hex);

  r = Math.min(255, Math.max(0, r * brightness));
  g = Math.min(255, Math.max(0, g * brightness));
  b = Math.min(255, Math.max(0, b * brightness));

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

export function makeColorSchema(primaryColor: string) {
  return css`
      :root {
          --primary: ${unsafeCSS(primaryColor)};
          --primary-50: ${hexToRGBA(primaryColor, 50)};
          --primary-12: ${hexToRGBA(primaryColor, 12)};
          --primary-hover: ${transformColor(primaryColor)};
          --secondary: ${unsafeCSS(primaryColor)}1f;
          --secondary-hover: ${unsafeCSS(primaryColor)}3d;
      }
  `
}
