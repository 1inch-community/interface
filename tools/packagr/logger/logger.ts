import { ILogger } from './logger-interface';
import { debounce } from '../debounce';

export class Logger implements ILogger {

  static now(globalContextName: string): ILogger {
    return new Logger(globalContextName, new LogStorage());
  }

  private constructor(public readonly globalContextName: string,
                      private readonly logStorage: LogStorage,
                      private readonly parent?: ILogger) {
    this.logStorage.addNode(this.globalContextName, this.parent?.globalContextName);
  }

  error(message: string, error: unknown): void {
    const node = this.logStorage.getNode(this.globalContextName)!;
    node.error.set(message, error);
    render(this.logStorage);
  }

  log(message: string): void {
    const node = this.logStorage.getNode(this.globalContextName)!;
    node.message = message;
    render(this.logStorage);
  }

  removeError(message: string): void {
    const node = this.logStorage.getNode(this.globalContextName)!;
    node.error.delete(message);
    render(this.logStorage);
  }

  setLoadingState(state: boolean): void {
    const node = this.logStorage.getNode(this.globalContextName)!;
    node.isLoading = state;
    render(this.logStorage);
  }

  fork(globalContextName: string): ILogger {
    return new Logger(globalContextName, this.logStorage, this);
  }
}

type LogNode = {
  name: string
  message: string
  isLoading: boolean
  error: Map<string, unknown>
  child: LogNode[]
  parent: LogNode | null
}

class LogStorage {
  private storage: Map<string, LogNode> = new Map();

  addNode(name: string, parentName?: string) {
    let parentNode = null;
    if (parentName) {
      parentNode = this.storage.get(parentName) ?? null;
    }
    const newNode: LogNode = {
      name,
      message: '',
      isLoading: false,
      error: new Map(),
      child: [],
      parent: parentNode
    };
    parentNode?.child.push(newNode);
    this.storage.set(name, newNode);
  }

  getNode(name: string) {
    return this.storage.get(name);
  }

  getSnapshot() {
    const root = this.storage.get([...this.storage.keys()][0]);
    if (!root) return '';
    const result: string[] = [];
    traverseLogNode(root, (node, deep) => {
      result.push(makeLogRow(node, deep));
    });

    return result.join('\n');
  }
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

function makeMessage(node: LogNode): string {
  if (node.error.size === 0) {
    return node.message;
  }
  const errors: string[] = [];
  node.error.forEach((error, name) => {
    const message = error instanceof Error ? error.message : `${error}`;
    errors.push(`${name} ${message}`);
  });
  return errors.join('\n');
}

function makeSpace(count: number) {
  return ' '.repeat(count);
}

function makeLogRow(node: LogNode, deep: number) {
  return `${makeSpace(deep)}${getStatusIcon([node.isLoading, node.error.size > 0])} [${node.name}] ${makeMessage(node)}`;
}

function traverseLogNode(node: LogNode, callback: (node: LogNode, depth: number) => void, depth: number = 0): void {
  callback(node, depth);

  for (const child of node.child) {
    traverseLogNode(child, callback, depth + 1);
  }
}

const render = debounce((storage: LogStorage) => {
  const snapshot = storage.getSnapshot();
  process.stdout.write('\x1Bc');
  process.stdout.write(snapshot);
  process.stdout.write(`\n\nPress Ctrl-C for cancel`);
}, 0);

// const render = (storage: LogStorage) => {
//   const snapshot = storage.getSnapshot();
//   process.stdout.write('\x1Bc');
//   process.stdout.write(snapshot);
//   process.stdout.write(`\n\nPress Ctrl-C for cancel`);
// };
