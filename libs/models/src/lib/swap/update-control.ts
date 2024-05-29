export interface UpdateControl {
  updateComplete(): Promise<void>
  update(): void;
  addHook(hook: () => void): void
  reset(): void
}
