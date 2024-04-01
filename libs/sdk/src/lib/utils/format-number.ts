export function formatNumber(value: string, decimalPlaces: number): string {
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