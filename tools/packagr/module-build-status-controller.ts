import { EventEmitter } from 'events';

export type ModuleBuildStatus = 'pre-build' | 'building' | 'ready'

export class ModuleBuildStatusController {
  private readonly statusMap = new Map<string, ModuleBuildStatus>()
  private readonly emitter = new EventEmitter()

  constructor(modules: string[]) {
    for (const module of modules) {
      this.statusMap.set(module, 'pre-build')
    }
  }

  changeStatus(moduleName: string, status: ModuleBuildStatus): void {
    this.statusMap.set(moduleName, status)
    this.emitter.emit(moduleName, status)
  }

  isReady(moduleName: string) {
    const status = this.statusMap.get(moduleName)
    return status === 'ready'
  }

  waitReady(moduleName: string): Promise<void> {
    return new Promise(resolve => {
      if (this.isReady(moduleName)) {
        resolve()
      }
      this.emitter.once(moduleName, resolve)
    })
  }

}
