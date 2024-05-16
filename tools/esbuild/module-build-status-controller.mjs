import { EventEmitter } from 'events';

export class ModuleBuildStatusController {

  modulesMap = new Map()
  emitter = new EventEmitter()

  addModule(name) {
    this.setStatus(name, 'prebuild')
  }

  setStatus(name, status) {
    this.modulesMap.set(name, status)
    this.emitter.emit(name, status)
  }

  on(moduleName, handler) {
    this.emitter.on(moduleName, handler)
  }

}
