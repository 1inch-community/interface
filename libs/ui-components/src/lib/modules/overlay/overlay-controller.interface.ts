import { TemplateResult } from 'lit';

export interface IOverlayController {
  readonly isOpen: boolean
  open(openTarget: TemplateResult | HTMLElement): Promise<number>
  close(overlayId: number): Promise<void>
  isOpenOverlay(overlayId: number): boolean
}