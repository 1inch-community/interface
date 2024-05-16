import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';

export class ThreadController {
  activeWorkers = new Set()

  constructor(file, logger, handlers) {
    this.file = file;
    this.handlers = handlers;
    this.logger = logger;
    process.once('exit', error => {
      this.terminateAll()
    })
    process.once('SIGINT', error => {
      this.terminateAll()
    })
    process.once('SIGUSR1', error => {
      this.terminateAll()
    })
    process.once('SIGUSR2', error => {
      this.terminateAll()
    })

    this.handle().then()
  }

  async execute(handlerName, args) {
    if (!isMainThread) {
      throw new Error('thread is not main thread')
    }
    return new Promise((resolve, reject) => {

      const worker = new Worker(this.file, {
        workerData: [ handlerName, args]
      });
      this.activeWorkers.add(worker)
      worker.on('message', (message) => {
        if (!Array.isArray(message)) {
          throw new Error('message must be an array')
        }
        const [ name, payload ] = message
        if (name === 'result') {
          this.activeWorkers.delete(worker)
          worker.terminate()
          resolve(payload);
        }
        if (name === 'logger') {
          const [ methodName, args ] = payload
          this.logger[methodName](...args)
        }

      })
      worker.once('exit', error => {
        this.activeWorkers.delete(worker)
        reject(error)
      })
    })
  }

  async handle() {
    if (!isMainThread) {
      setTimeout(() => {
        process.exit(-2)
      }, 300000)

      const [ handlerName, args ] = workerData
      process.title = `${handlerName}-worker`
      try {
        const handler = this.handlers[handlerName]
        const result = await handler(...args)
        parentPort.postMessage([ 'result', result ]);
      } catch (error) {
        process.exit(-1)
      }
    }
  }

  terminateAll() {
    [ ...this.activeWorkers ].forEach(worker => {
      worker.terminate()
      this.activeWorkers.delete(worker)
    })
  }
}
