export interface Initialized {
    initialize(): Promise<void> | void;
}
