import { CSSResult, unsafeCSS } from 'lit';

export function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios');
}

export function isStandalone(): boolean {
  return (window?.navigator as any)?.standalone ?? false
}

export function safariPWACss(style: CSSResult): CSSResult {
  if (isSafari() && isStandalone()) {
    return unsafeCSS(style)
  }
  return unsafeCSS('')
}
