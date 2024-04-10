import { IOverlayController } from './overlay-controller.interface';
import { TemplateResult } from 'lit';

export class OverlayDesktopController implements IOverlayController {

  constructor(private target: HTMLElement | 'center') {
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<() => Promise<void>> {

    return async () => {}
  }

}