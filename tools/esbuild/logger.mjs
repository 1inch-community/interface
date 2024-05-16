import { parentPort } from 'worker_threads';

export class Logger {

  modules = new Map()
  isLoading = false
  libName
  isWatch

  constructor(libName, isWatch, modules) {
    for (const module of (modules ?? [])) {
      this.addModule(module)
    }
    this.libName = libName
    this.isWatch = isWatch
    this.show()

    setInterval(() => {
      this.show()
    }, 500)
  }

  setStatus(moduleName, statusName, isLoading) {
    const statusContext = this.modules.get(moduleName) ?? defaultStatus()
    statusContext.isLoading = isLoading ?? false
    statusContext.statusName = statusName
    this.modules.set(moduleName, statusContext)
    this.show()
  }

  setError(moduleName, errorName, error) {
    const statusContext = this.modules.get(moduleName) ?? defaultStatus()
    if (error === null) {
      statusContext.error.delete(errorName)
    } else {
      statusContext.error.set(errorName, error)
    }
    this.modules.set(moduleName, statusContext)
    this.show()
    if (!this.isWatch && error !== null) {
      // process.exit(-1)
    }
  }

  addModule(moduleName) {
    this.modules.set(moduleName, defaultStatus())
  }

  show() {
    const scene = []
    for (const [moduleName, status] of this.modules) {
      const statusIcon = getStatusIcon(status)
      const error = getError(status)

      scene.push([
        statusIcon,
        `[${moduleName}]`,
        error ? null : status.statusName,
        ...(error ?? [])
      ].filter(Boolean).join(' '))
    }
    return

    process.stdout.write('\x1Bc')
    process.stdout.write(`${this.isWatch ? 'Watch' : 'Build'} library ${this.libName}\n\n`);
    process.stdout.write(`${scene.join('\n')}`);
    process.stdout.write(`\n\nPress Ctrl-C for cancel`);
  }

}

function getError(status) {
  if (status.error.size) {
    const errorName = status.error.keys().next().value
    const error = status.error.get(errorName) ?? {}
    return [
      `[${errorName}]`,
      [
        error.message,
        error.stack
      ].join('\n')
    ]
  }

  return null
}

function defaultStatus() {
  return {
    isLoading: false,
    statusName: '',
    error: new Map()
  }
}

function getStatusIcon(status) {
  if (status.isLoading) {
    return '⏳'
  }

  if (status.error.size) {
    return '❌'
  }
  return '✅'
}

export class ThreadLogger {
  setStatus(moduleName, statusName, isLoading) {
    parentPort.postMessage([ 'logger', [ 'setStatus', [moduleName, statusName, isLoading] ] ]);
  }

  setError(moduleName, errorName, error) {
    parentPort.postMessage([ 'logger', [ 'setError', [moduleName, errorName, error] ] ]);
  }

  addModule(moduleName) {
    parentPort.postMessage([ 'logger', [ 'setStatus', [ moduleName ] ] ]);
  }
}
