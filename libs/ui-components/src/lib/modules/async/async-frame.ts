export function asyncFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}