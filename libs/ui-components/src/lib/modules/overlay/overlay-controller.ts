import { IOverlayController } from './overlay-controller.interface';
import { TemplateResult } from 'lit';
import { OverlayMobileController } from './overlay-mobile-controller';
import { OverlayDesktopController } from './overlay-desktop-controller';
import { getMobileMatchMedia } from '../lit/match-media';

export class OverlayController implements IOverlayController {

    private readonly mobileOverlay: IOverlayController
    private readonly desktopOverlay: IOverlayController

    private readonly mobileMedia = getMobileMatchMedia()

    get isOpen() {
        if (this.mobileMedia.matches) {
            return this.mobileOverlay.isOpen;
        }
        return this.desktopOverlay.isOpen
    }

    constructor(
      rootNodeName: string,
      target: HTMLElement | 'center'
    ) {
        this.mobileOverlay = new OverlayMobileController(rootNodeName)
        this.desktopOverlay = new OverlayDesktopController(target)
    }

    async open(openTarget: TemplateResult | HTMLElement): Promise<number> {
        if (this.mobileMedia.matches) {
            return await this.mobileOverlay.open(openTarget);
        }
        return await this.desktopOverlay.open(openTarget)
    }

    async close(overlayId: number): Promise<void> {
        if (this.mobileMedia.matches) {
            return await this.mobileOverlay.close(overlayId);
        }
        return await this.desktopOverlay.close(overlayId);
    }
}