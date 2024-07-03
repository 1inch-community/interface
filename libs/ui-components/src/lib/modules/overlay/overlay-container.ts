const container = document.createElement('div')
container.id = 'overlay-container'
export function getContainer() {
  if (!document.body.contains(container)) {
    document.body.appendChild(container)
  }
  return container
}
