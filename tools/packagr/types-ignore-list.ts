export const typesIgnoreList = [
  '.style.ts',
  '.animation.ts',
  '.svg.ts',
  '.png.ts',
]

export function inIgnoreList(target: string) {
  return typesIgnoreList.some(item => target.toLowerCase().includes(item.toLowerCase()))
}
