export interface ILogger {
  readonly globalContextName: string
  error(message: string, error: unknown): void;
  removeError(message: string): void;
  log(message: string): void;
  setLoadingState(state: boolean): void
  fork(globalContextName: string): ILogger
}

export interface ILoggerInternal extends ILogger {
  openContext(localContextName: string): void
  closeContext(): void
  render(context?: IContext[]): void
}

export interface IContext {
  name: string
  message: string
  parentContextName: string
  isLoading: boolean
  error: Map<string, unknown>
}

