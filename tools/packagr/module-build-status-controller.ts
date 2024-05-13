import { EventEmitter } from 'events';
import { getModuleFullName } from './names';

export type ModuleBuildStatus = 'pre-build' | 'building' | 'ready'

export class ModuleBuildStatusController {
  private readonly statusMap = new Map<string, ModuleBuildStatus>()
  private readonly emitter = new EventEmitter()

  constructor(
    modules: string[],
    private projectName: string,
    private libName: string
  ) {
    for (const module of modules) {
      this.changeStatus(module, 'pre-build')
    }
  }

  changeStatus(moduleName: string, status: ModuleBuildStatus): void {
    const name = getModuleFullName(this.projectName, this.libName, moduleName)
    this.statusMap.set(name, status)
    this.emitter.emit(name, status)
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
