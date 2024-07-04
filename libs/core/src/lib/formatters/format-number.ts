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

export function smartFormatNumber(value: string, charsAfterZero: number, defaultDecimalPlaces: number = charsAfterZero): string {
  if (value.length === 1) return value
  const dotIndex = value.indexOf('.');
  if (dotIndex === -1) {
    return formatNumber(value, defaultDecimalPlaces)
  }
  if (value.slice(0, dotIndex).length > 1) {
    return formatNumber(value, defaultDecimalPlaces)
  }
  let decimals = 0
  for (let i = dotIndex + 1; i < value.length; i++) {
    const char = value[i]
    if (char === '0') {
      decimals++
    } else {
      return formatNumber(value, decimals + charsAfterZero)
    }
  }
  return formatNumber(value, defaultDecimalPlaces)
}

export function smartFormatAndShorteningNumber(value: string, charsAfterZero: number, defaultDecimalPlaces: number = charsAfterZero) {
  if (value.length === 1) return value
  const formated = smartFormatNumber(value, charsAfterZero, defaultDecimalPlaces)
  const cleanedFormated = formated.replace(/\s+/g, '');
  const [integerPart] = cleanedFormated.split('.');
  const len = integerPart.length

  if (len <= 6) {
    return formated
  }
  if (len > 6 && len <= 9) {
    const millions = cleanedFormated.slice(0, len - 6);
    const remainder = cleanedFormated.slice(len - 6, len - 5);
    return `${millions}.${remainder}M`;
  }

  const billions = cleanedFormated.slice(0, len - 9);
  const remainder = cleanedFormated.slice(len - 9, len - 8);
  return `${billions}.${remainder}B`;
}

export function formatSeconds(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= (24 * 3600);
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}D`);
  }
  if (hours > 0) {
    parts.push(`${hours}H`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
}

export function parseTimeString(timeString: string): number {
  const timeParts = timeString.split(' ');
  let totalSeconds = 0;

  for (const part of timeParts) {
    const unit = part.slice(-1);
    const value = parseInt(part.slice(0, -1), 10);

    if (isNaN(value)) {
      continue;
    }

    switch (unit) {
      case 'd':
        totalSeconds += value * 24 * 3600;
        break;
      case 'h':
        totalSeconds += value * 3600;
        break;
      case 'm':
        totalSeconds += value * 60;
        break;
      case 's':
        totalSeconds += value;
        break;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  return totalSeconds;
}
