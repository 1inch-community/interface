import { Hex } from 'viem';

export type FormatHexParams = {
  width?: number,
  head?: number,
  tail?: number,
};


export function formatHex(hex: Hex, params: FormatHexParams = {}): string {
  const {
    width,
    head = 6,
    tail = 4,
  } = params;

  if (width !== undefined && (width > 1410 || (940 > width && width > 800))) {
    return hex;
  }

  return `${hex.slice(0, head)}...${hex.slice(hex.length - tail)}`;

}