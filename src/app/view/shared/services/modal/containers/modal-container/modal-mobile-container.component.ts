import { animate, style, transition, trigger } from '@angular/animations';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {ModalContainerComponent} from "./modal-container.component";
import {ButtonComponent} from "../../../../components/button/button.component";


@Component({
    selector: 'inch-modal-mobile-container',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonComponent],
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss', './modal-mobile-container.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('show-hide', [
            transition('* => enter', [
                style({ transform: 'translateY(100%)' }),
                animate('150ms',
                    style({ transform: 'translateY(0%)' })),
            ]),
            transition('enter => leave', [
                style({ transform: 'translateY(0%)' }),
                animate('100ms',
                    style({ transform: 'translateY(100%)' })),
            ]),
        ]),
    ],
})
export class ModalMobileContainerComponent extends ModalContainerComponent {

}
