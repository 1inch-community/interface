export interface ILogger {
  error(message: string, error: Error): void;
  removeError(message: string): void;
  log(message: string): void;
  setLoadingState(state: boolean): void
}

export interface ILibraryLogger extends ILogger {
  fork(moduleName: string): ILogger
  openContext(moduleName: string): void
  closeContext(): void
}
