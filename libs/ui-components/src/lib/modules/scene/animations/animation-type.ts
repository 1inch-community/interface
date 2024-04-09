export type AnimationType = {
  beforeAppend(upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean): Promise<void>
  afterAppend(upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean): Promise<void>
}
