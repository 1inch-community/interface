export function appendStyle(target: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  for (const style in styles) {
    target.style[style] = styles[style] ?? ''
  }
}