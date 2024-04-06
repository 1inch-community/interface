export function formatNumber(value: string, decimalPlaces: number): string {
  const valueFormatDecimals = formatDecimals(value, decimalPlaces)
  const parts = valueFormatDecimals.split('.');

  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length > 1) {
    return `${integerPart}.${parts[1]}`;
  }

  return integerPart;
}

export function formatDecimals(value: string, decimalPlaces: number): string {
  const dotIndex = value.indexOf('.');
  if (dotIndex === -1) {
    return value
  }

  const digitsAfterDot = value.length - dotIndex - 1;
  if (digitsAfterDot <= decimalPlaces) {
    return value;
  }

  if (decimalPlaces > 0) {
    const cutoffIndex = dotIndex + decimalPlaces + 1;
    return value.substring(0, cutoffIndex);
  }
  return value.substring(0, dotIndex);
}