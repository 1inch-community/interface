import { IOverlayController } from './overlay-controller.interface';
import { TemplateResult } from 'lit';

export class OverlayController implements IOverlayController {

    async open(openTarget: TemplateResult | HTMLElement): Promise<() => Promise<void>> {

        return async () => {}
    }
}