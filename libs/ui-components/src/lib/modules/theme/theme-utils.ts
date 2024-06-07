export function getCssValue(cssVarName: string): string {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return  style.getPropertyValue(cssVarName).trim();
}
