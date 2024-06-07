const container = document.createElement('div')
export function getContainer() {
  if (!document.body.contains(container)) {
    document.body.appendChild(container)
  }
  return container
}
