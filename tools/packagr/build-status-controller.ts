import { EventEmitter } from 'events';
import { getModuleFullName, getLibraryFullName } from './names';

export type BuildStatus = 'pre-build' | 'building' | 'ready'

export class BuildStatusController {
  private readonly statusMap = new Map<string, BuildStatus>()
  private readonly emitter = new EventEmitter()

  constructor(
    builders: string[],
    private projectName: string,
    private libName?: string
  ) {
    for (const builder of builders) {
      this.changeStatus(builder, 'pre-build')
    }
  }

  changeStatus(name: string, status: BuildStatus): void {
    let _name = ''
    if (this.libName) {
      _name = getModuleFullName(this.projectName, this.libName, name)
    } else {
      _name = getLibraryFullName(this.projectName, name)
    }
    this.statusMap.set(_name, status)
    this.emitter.emit(_name, status)
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
