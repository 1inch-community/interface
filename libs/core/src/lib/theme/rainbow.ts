import { unsafeCSS } from 'lit';
import { rainbowRandomColorsInterpolate } from './themes/color-utils';

export function getRainbowGradient() {
  return unsafeCSS(`linear-gradient(90deg, ${unsafeCSS(rainbowRandomColorsInterpolate.join(','))})`)
}
