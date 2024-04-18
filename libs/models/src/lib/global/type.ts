export declare const Type: FunctionConstructor;

// eslint-disable-next-line @typescript-eslint/ban-types
export declare interface Type<T> extends Function {
  new (...args: unknown[]): T;
}