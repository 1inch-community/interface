import { TemplateResult } from 'lit';

export interface IOverlayController {
  open(openTarget: TemplateResult | HTMLElement): Promise<() => Promise<void>> // return close function
}