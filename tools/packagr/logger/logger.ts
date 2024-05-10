import { ILogger, ILibraryLogger } from './logger-interface';
import { getProjectPackageJson } from '../files';

type LoggerContext = {
  isLoading: boolean
  title: string
  message: string
  error: Map<string, Error>
}

export class Logger implements ILibraryLogger {

  private currentContext: string | null = null;

  private globalContext: LoggerContext = getNewContext();

  private loggerContext: Map<string, LoggerContext> = new Map();

  private version = ''

  constructor(
    private readonly libName: string,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean,
    private readonly oneModuleLibrary: boolean
  ) {
    this.globalContext.title = `Library ${libName}`;
    getProjectPackageJson().then(pkg => {
      this.version = pkg.version
    });
    this.render();
  }

  openContext(moduleName: string): void {
    if (this.currentContext !== null) throw new Error(`the context ${this.currentContext} was not closed`);
    this.currentContext = moduleName;
  }

  closeContext(): void {
    this.currentContext = null;
    this.render();
  }

  fork(moduleName: string): ILogger {
    return new ModuleLogger(this, moduleName);
  }

  error(message: string, error: Error): void {
    if (this.currentContext) {
      const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
      context.title = this.currentContext;
      context.error.set(message, error);
      this.loggerContext.set(this.currentContext, context);
    } else {
      this.globalContext.error.set(message, error);
      this.render();
    }
  }

  log(message: string): void {
    if (this.currentContext) {
      const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
      context.title = this.currentContext;
      context.message = message;
      this.loggerContext.set(this.currentContext, context);
    } else {
      this.globalContext.message = message;
      this.render();
    }
  }

  removeError(message: string): void {
    if (this.currentContext) {
      const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
      context.title = this.currentContext;
      context.error.delete(message);
      this.loggerContext.set(this.currentContext, context);
    } else {
      this.globalContext.error.delete(message);
      this.render();
    }
  }

  setLoadingState(state: boolean): void {
    if (this.currentContext) {
      const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
      context.title = this.currentContext;
      context.isLoading = state;
      this.loggerContext.set(this.currentContext, context);
    } else {
      this.globalContext.isLoading = state;
      this.render();
    }
  }

  private render() {
    const logs: string[] = [];

    this.loggerContext.forEach(context => {
      logs.push([
        getStatusIcon([context.isLoading, context.error.size > 0]),
        `[${context.title}]`,
        `${context.message}`
      ].join(' '));
    });

    const globalLog = [
      `${this.globalContext.title}`,
      `${this.globalContext.message}`
    ].join(' ');

    process.stdout.write('\x1Bc');
    process.stdout.write(`${this.isWatch ? 'Watch' : 'Build'} library ${this.libName}, ${this.isProduction ? 'production' : 'developer'}, v${this.version}\n`);
    process.stdout.write(`${globalLog}\n\n`);
    process.stdout.write(`Build modules status:\n`);
    process.stdout.write(`${logs.join('\n')}`);
    process.stdout.write(`\n\nPress Ctrl-C for cancel`);
  }

}

class ModuleLogger implements ILogger {

  constructor(
    private readonly globalLogger: ILibraryLogger,
    private readonly moduleName: string
  ) {
  }

  removeError(message: string): void {
    this.globalLogger.openContext(this.moduleName);
    this.globalLogger.removeError(message);
    this.globalLogger.closeContext();
  }

  setLoadingState(state: boolean): void {
    this.globalLogger.openContext(this.moduleName);
    this.globalLogger.setLoadingState(state);
    this.globalLogger.closeContext();
  }

  error(message: string, error: Error): void {
    this.globalLogger.openContext(this.moduleName);
    this.globalLogger.error(message, error);
    this.globalLogger.closeContext();
  }

  log(message: string): void {
    this.globalLogger.openContext(this.moduleName);
    this.globalLogger.log(message);
    this.globalLogger.closeContext();
  }

}

export function buildLogger(libName: string, isWatch: boolean, isProduction: boolean, oneModuleLibrary: boolean) {
  return new Logger(
    libName,
    isWatch,
    isProduction,
    oneModuleLibrary
  );
}

function getNewContext(): LoggerContext {
  return {
    isLoading: false,
    title: '',
    message: '',
    error: new Map()
  };
}

function getStatusIcon([isLoading, isError]: [boolean, boolean]) {
  if (isLoading) {
    return '⏳';
  }

  if (isError) {
    return '❌';
  }
  return '✅';
}
