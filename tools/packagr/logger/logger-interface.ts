export interface ILogger {
  readonly globalContextName: string
  error(message: string, error: unknown): void;
  removeError(message: string): void;
  log(message: string): void;
  setLoadingState(state: boolean): void
  fork(globalContextName: string): ILogger
}
