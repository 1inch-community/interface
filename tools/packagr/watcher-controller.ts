import { ILogger } from './logger';
import * as fs from 'fs';
import { debounce } from './debounce';

export class WatcherController {

  private readonly paths = new Set<string>()
  private watchers: fs.FSWatcher[] = []
  private isWork = false
  private rebuildInProgress = false

  private readonly rebuildDebounce = debounce(() => this.rebuild(), 100)

  constructor(
    private readonly logger: ILogger,
    private readonly rebuildCallback: () => Promise<void>
  ) {
  }

  addPath(watchPath: string) {
    this.paths.add(watchPath)
    this.update()
  }

  addPaths(watchPaths: string[]) {
    watchPaths.forEach(path => this.paths.add(path))
    this.update()
  }

  start() {
    if (this.isWork) {
      return
    }
    this.stop()
    this.paths.forEach(path => {
      this.watchers.push(fs.watch(path, { recursive: true }, () => this.rebuildDebounce()))
    })
    this.isWork = true
  }

  stop() {
    if (!this.isWork) {
      return
    }
    this.watchers.forEach(watcher => watcher.close())
    this.watchers = []
    this.isWork = false
  }

  update() {
    if (this.isWork) {
      this.stop()
      this.start()
    }
  }

  async rebuild() {
    if (this.rebuildInProgress) return
    this.rebuildInProgress = true
    try {
      await this.rebuildCallback()
    } catch (error) {

    }
    this.rebuildInProgress = false
  }

}
