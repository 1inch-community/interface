import { getMobileMatchMedia } from '@one-inch-community/core/lit';

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
