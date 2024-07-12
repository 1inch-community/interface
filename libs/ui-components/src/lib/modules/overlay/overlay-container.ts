import { appendStyle } from '@one-inch-community/core/lit';

let container: HTMLElement

export function getContainer() {
  findOrCreateContainer()
  return container
}

function findOrCreateContainer() {
  if (container) return
  let overlayContainer = document.querySelector('#overlay-container') as HTMLElement
  if (!overlayContainer) {
    overlayContainer = document.createElement('div')
    overlayContainer.id = 'overlay-container'
  }
  container = overlayContainer
}
