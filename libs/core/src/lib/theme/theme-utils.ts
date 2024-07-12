const pattern = /(?<=var\().*?(?=\))/;
export function getCssValue(cssVarName: string): string {
  const match = cssVarName.match(pattern);
  const value = match ? match[0] : cssVarName;
  const style = getComputedStyle(document.documentElement);
  return  style.getPropertyValue(value).trim();
}
