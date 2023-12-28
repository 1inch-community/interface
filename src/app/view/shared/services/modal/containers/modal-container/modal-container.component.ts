import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { CdkDialogContainer, DialogModule } from '@angular/cdk/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    NgZone,
    Optional,
    ViewEncapsulation,
} from '@angular/core';
import {dataModalToken, refModalToken} from "../../injection-tokens";
import {ModalRef} from "../../modal-ref";
import {ModalContainerConfig} from "../../modal-container-config";
import {ModalAnimation} from "../../modal-animation";
import {ButtonComponent} from "../../../../components/button/button.component";


@Component({
    selector: 'inch-modal-container',
    standalone: true,
  imports: [CommonModule, DialogModule, ButtonComponent],
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('show-hide', [
            transition('* => enter', [
                style({ transform: 'scale(0.9)' }),
                animate('150ms',
                    style({ transform: 'scale(1)' })),
            ]),
            transition('enter => leave', [
                style({ transform: 'scale(1)' }),
                animate('75ms',
                    style({ transform: 'scale(0.9)' })),
            ]),
        ]),
    ],
})
export class ModalContainerComponent extends CdkDialogContainer<any> {

    protected readonly animation$ = this.ref.animation$;

    protected readonly title$ = this.ref.title$;

    constructor(
        @Inject(refModalToken) protected readonly ref: ModalRef,
        @Inject(dataModalToken) protected readonly data: ModalContainerConfig,
        elementRef: ElementRef,
        focusTrapFactory: FocusTrapFactory,
        @Optional() @Inject(DOCUMENT) _document: any,
        interactivityChecker: InteractivityChecker,
        ngZone: NgZone,
        overlayRef: OverlayRef,
        focusMonitor?: FocusMonitor,
    ) {
        super(
            elementRef,
            focusTrapFactory,
            document,
            {},
            interactivityChecker,
            ngZone,
            overlayRef,
            focusMonitor,
        );
    }

    protected onClose() {
        this.ref.close();
    }

    protected onAnimationDone(event: AnimationEvent) {
        if (
            (event.fromState as ModalAnimation) === ModalAnimation.enter
            && (event.toState as ModalAnimation) === ModalAnimation.leave
        ) {
            this.ref.completeClose();
        }
    }

}
