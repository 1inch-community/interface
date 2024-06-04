export type Animation = {
  preparation(upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean): Promise<void>
  transition(upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean): Promise<void>
}
