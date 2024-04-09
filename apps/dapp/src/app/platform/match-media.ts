export function getMobileMatchMedia() {
  return matchMedia('(max-width: 450px)')
}

export function getHeaderHeight() {
  const mobileMedia = getMobileMatchMedia()
  if (mobileMedia.matches) {
    return 56
  }
  return 72
}

export function getFooterHeight() {
  const mobileMedia = getMobileMatchMedia()
  if (mobileMedia.matches) {
    return 56
  }
  return 72
}