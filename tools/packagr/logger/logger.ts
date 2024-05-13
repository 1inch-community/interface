// import { ILogger, ILibraryLogger } from './logger-interface';
// import { getProjectPackageJson } from '../files';
// import { ModuleLogger } from './module-logger';
//
// type LoggerContext = {
//   isLoading: boolean
//   title: string
//   message: string
//   error: Map<string, unknown>
// }
//
// export class Logger implements ILibraryLogger {
//
//   private currentContext: string | null = null;
//
//   private globalContext: LoggerContext = getNewContext();
//
//   private loggerContext: Map<string, LoggerContext> = new Map();
//
//   private version = ''
//
//   constructor(
//     private readonly libName: string,
//     private readonly isWatch: boolean,
//     private readonly isProduction: boolean
//   ) {
//     this.globalContext.title = `Library ${libName}`;
//     getProjectPackageJson().then(pkg => {
//       this.version = pkg.version
//     });
//     this.render();
//   }
//
//   openContext(moduleName: string): void {
//     if (this.currentContext !== null) throw new Error(`the context ${this.currentContext} was not closed`);
//     this.currentContext = moduleName;
//   }
//
//   closeContext(): void {
//     this.currentContext = null;
//     this.render();
//   }
//
//   fork(moduleName: string): ILogger {
//     return new ModuleLogger(this, moduleName);
//   }
//
//   error(message: string, error: unknown): void {
//     if (this.currentContext) {
//       const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
//       context.title = this.currentContext;
//       context.error.set(message, error);
//       this.loggerContext.set(this.currentContext, context);
//     } else {
//       this.globalContext.error.set(message, error);
//       this.render();
//     }
//   }
//
//   log(message: string): void {
//     if (this.currentContext) {
//       const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
//       context.title = this.currentContext;
//       context.message = message;
//       this.loggerContext.set(this.currentContext, context);
//     } else {
//       this.globalContext.message = message;
//       this.render();
//     }
//   }
//
//   removeError(message: string): void {
//     if (this.currentContext) {
//       const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
//       context.title = this.currentContext;
//       context.error.delete(message);
//       this.loggerContext.set(this.currentContext, context);
//     } else {
//       this.globalContext.error.delete(message);
//       this.render();
//     }
//   }
//
//   setLoadingState(state: boolean): void {
//     if (this.currentContext) {
//       const context = this.loggerContext.get(this.currentContext) ?? getNewContext();
//       context.title = this.currentContext;
//       context.isLoading = state;
//       this.loggerContext.set(this.currentContext, context);
//     } else {
//       this.globalContext.isLoading = state;
//       this.render();
//     }
//   }
//
//   private render() {
//     const logs: string[] = [];
//
//     this.loggerContext.forEach(context => {
//       logs.push([
//         getStatusIcon([context.isLoading, context.error.size > 0]),
//         `[${context.title}]`,
//         `${makeMessage(context)}`
//       ].join(' '));
//     });
//
//     const globalLog = [
//       `${this.globalContext.title}`,
//       `${this.globalContext.message}`
//     ].join(' ');
//
//     process.stdout.write('\x1Bc');
//     process.stdout.write(`${this.isWatch ? 'Watch' : 'Build'} library ${this.libName}, ${this.isProduction ? 'production' : 'developer'}, v${this.version}\n`);
//     process.stdout.write(`${globalLog}\n\n`);
//     process.stdout.write(`Build modules status:\n`);
//     process.stdout.write(`${logs.join('\n')}`);
//     process.stdout.write(`\n\nPress Ctrl-C for cancel`);
//   }
//
// }
//
// function getNewContext(): LoggerContext {
//   return {
//     isLoading: false,
//     title: '',
//     message: '',
//     error: new Map()
//   };
// }
//
// function getStatusIcon([isLoading, isError]: [boolean, boolean]) {
//   if (isLoading) {
//     return '⏳';
//   }
//
//   if (isError) {
//     return '❌';
//   }
//   return '✅';
// }
//
// function makeMessage(context: LoggerContext): string {
//   if (context.error.size === 0) {
//     return context.message
//   }
//   const errors: string[] = []
//   context.error.forEach((error, name) => {
//     const message = error instanceof Error ? error.message : `${error}`
//     errors.push(`${name} ${message}`)
//   })
//   return errors.join('\n')
// }

import { IContext, ILogger, ILoggerInternal } from './logger-interface';

export class Logger implements ILogger, ILoggerInternal {

  static now(globalContextName: string): ILogger {
    return new Logger(globalContextName);
  }

  private readonly contextMap = new Map<string, IContext>();
  private currentOpenContextName: string | null = null;
  private readonly nodeContext: IContext;

  private get currentContext() {
    if (!this.currentOpenContextName) {
      return this.nodeContext;
    }
    if (!this.contextMap.has(this.currentOpenContextName)) {
      this.contextMap.set(this.currentOpenContextName, getNewContext(this.currentOpenContextName, this.parent?.globalContextName));
    }
    return this.contextMap.get(this.currentOpenContextName)!;
  }

  private constructor(public readonly globalContextName: string, private readonly parent?: ILogger) {
    this.nodeContext = getNewContext(this.globalContextName, this.parent?.globalContextName);
  }

  error(message: string, error: unknown): void {
    if (isLogger(this.parent)) {
      this.parent.openContext(this.globalContextName);
      this.parent.error(message, error);
      this.parent.closeContext();
      return;
    }
    const context = this.currentContext;
    context.error.set(message, error);
    this.render();
  }

  log(message: string): void {
    if (isLogger(this.parent)) {
      this.parent.openContext(this.currentOpenContextName ?? this.globalContextName);
      this.parent.log(message);
      this.parent.closeContext();
      return;
    }
    const context = this.currentContext;
    context.message = message;
    this.render();
  }

  removeError(message: string): void {
    if (isLogger(this.parent)) {
      this.parent.openContext(this.globalContextName);
      this.parent.removeError(message);
      this.parent.closeContext();
      return;
    }
    const context = this.currentContext;
    context.error.delete(message);
    this.render();
  }

  setLoadingState(state: boolean): void {
    if (isLogger(this.parent)) {
      this.parent.openContext(this.globalContextName);
      this.parent.setLoadingState(state);
      this.parent.closeContext();
      return;
    }
    const context = this.currentContext;
    context.isLoading = state;
    this.render();
  }

  openContext(contextName: string): void {
    const name = [this.globalContextName, contextName].join(':');
    if (isLogger(this.parent)) {
      this.parent.openContext(name);
    }
    this.currentOpenContextName = name;
  }

  closeContext(): void {
    if (isLogger(this.parent)) {
      this.parent.closeContext();
    }
    this.currentOpenContextName = null;
    this.render();
  }

  fork(globalContextName: string): ILogger {
    return new Logger(globalContextName, this);
  }

  render() {
    if (isLogger(this.parent)) {
      return;
    }
    const log = [...this.contextMap.values()].sort((context1, context2) => {
      if (context1.parentContextName === context2.name) {
        return 1
      }
      if (context1.name === context2.parentContextName) {
        return -1
      }
      return 0
    }).map(({ name, message }) => `${name} ${message}`)
    process.stdout.write('\x1Bc');
    process.stdout.write(log.join('\n'));
    process.stdout.write(`\n\nPress Ctrl-C for cancel`);
  }
}


function getNewContext(name: string, parentContextName: string = ''): IContext {
  return {
    name,
    parentContextName,
    isLoading: false,
    message: '',
    error: new Map()
  };
}

function isLogger(type: unknown): type is Logger {
  return type instanceof Logger;
}
