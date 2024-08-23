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

function hexToRgba(hex: string) {
  let r = 0, g = 0, b = 0, a = 1;

  // 3 or 4 digit hex
  if (hex.length == 4 || hex.length == 5) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
    if (hex.length == 5) {
      a = parseInt(hex[4] + hex[4], 16) / 255;
    }
  }
  // 6 or 8 digit hex
  else if (hex.length == 7 || hex.length == 9) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
    if (hex.length == 9) {
      a = parseInt(hex[7] + hex[8], 16) / 255;
    }
  }
  return [r, g, b, a];
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbaToHex(r: number, g: number, b: number, a: number) {
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  const hexA = a.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

export function rgbaStrToHex(rgbaString: string): string {
  const result = rgbaString.match(/\d+(\.\d+)?/g);
  if (result === null || result.length !== 4) {
    throw new Error('Invalid rgba string');
  }

  const r = parseInt(result[0]);
  const g = parseInt(result[1]);
  const b = parseInt(result[2]);
  const a = Math.round(parseFloat(result[3]) * 255);

  return rgbaToHex(r, g, b, a);
}

export function rgbStrToHex(rgbaString: string): string {
  const parts = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)%?)?\)/);
  if (!parts) {
    throw new Error('Invalid rgba format.');
  }
  const r = parseInt(parts[1]);
  const g = parseInt(parts[2]);
  const b = parseInt(parts[3]);

  return rgbToHex(r, g, b);
}

export function blendColors(baseColor: string, overlayColor: string) {
  const base = hexToRgba(baseColor + 'ff');
  const overlay = hexToRgba(overlayColor);

  const r = Math.round((1 - overlay[3]) * base[0] + overlay[3] * overlay[0]);
  const g = Math.round((1 - overlay[3]) * base[1] + overlay[3] * overlay[1]);
  const b = Math.round((1 - overlay[3]) * base[2] + overlay[3] * overlay[2]);
  const a = base[3];

  return rgbaToHex(r, g, b, a);
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
  return unsafeCSS(`rgba(${r}, ${g}, ${b}, 0.${alfa})`);
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

export function makeColorSchema(primaryColor: string, targetName = ':root') {
  return css`
      ${unsafeCSS(targetName)} {
          --primary: ${unsafeCSS(primaryColor)};
          --primary-50: ${hexToRGBA(primaryColor, 50)};
          --primary-12: ${hexToRGBA(primaryColor, 12)};
          --primary-5: ${hexToRGBA(primaryColor, 5)};
          --primary-1: ${hexToRGBA(primaryColor, 1)};
          --primary-hover: ${transformColor(primaryColor)};
          --secondary: ${unsafeCSS(primaryColor)}1f;
          --secondary-hover: ${unsafeCSS(primaryColor)}3d;
      }
  `
}
