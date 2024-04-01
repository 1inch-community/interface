export class Logger {

  modules = new Map()
  isLoading = false
  libName
  isWatch

  constructor(libName, isWatch, modules) {
    for (const module of modules) {
      this.addModule(module)
    }
    this.libName = libName
    this.isWatch = isWatch
    this.show()
  }

  setStatus(moduleName, statusName, isLoading) {
    const statusContext = this.modules.get(moduleName) ?? defaultStatus()
    statusContext.isLoading = isLoading ?? false
    statusContext.statusName = statusName
    this.modules.set(moduleName, statusContext)
    this.show()
  }

  setError(moduleName, error) {
    const statusContext = this.modules.get(moduleName) ?? defaultStatus()
    statusContext.error = error
    this.modules.set(moduleName, statusContext)
    this.show()
  }

  addModule(moduleName) {
    this.modules.set(moduleName, defaultStatus())
  }

  show() {
    const scene = []
    for (const [moduleName, status] of this.modules) {
      const statusIcon = getStatusIcon(status)
      const error = []
      if (status.error) {
        error.push(status.error.message)
        error.push(status.error.stack)
      }

      scene.push([
        statusIcon,
        `[${moduleName}]`,
        status.error ? null : status.statusName,
        ...error
      ].filter(Boolean).join(' '))
    }

    process.stdout.write('\x1Bc')
    process.stdout.write(`${this.isWatch ? 'Watch' : 'Build'} library ${this.libName}\n\n`);
    process.stdout.write(`${scene.join('\n')}`);
    process.stdout.write(`\n\nPress Ctrl-C for cancel`);
  }

}

function defaultStatus() {
  return {
    isLoading: false,
    statusName: '',
    error: null
  }
}

function getStatusIcon(status) {
  if (status.isLoading) {
    return '⏳'
  }

  if (status.error) {
    return '❌'
  }
  return '✅'
}

