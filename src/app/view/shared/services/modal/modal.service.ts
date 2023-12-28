import { Dialog } from '@angular/cdk/dialog';
import { ComponentType, ScrollStrategy } from '@angular/cdk/overlay';
import { Injectable, StaticProvider, TemplateRef } from '@angular/core';
import {Initialized} from "@1inch/v3/core/shared";
import {ModalContainerConfig} from "./modal-container-config";
import { ModalRef } from './modal-ref';
import {dataModalToken, refModalToken} from "./injection-tokens";
import {PlatformService} from "../platform.service";
import {ModalMobileContainerComponent} from "./containers/modal-container/modal-mobile-container.component";
import {ModalContainerComponent} from "./containers/modal-container/modal-container.component";

const defaultModalConfig: ModalContainerConfig = {
    showHeader: true,
};

@Injectable({
    providedIn: 'root',
})
export class ModalService implements Initialized {

    constructor(
        public dialog: Dialog,
        public platformService: PlatformService,
    ) {}

    initialize(): void {
    }

    open<D, R>(
        target: ComponentType<unknown> | TemplateRef<unknown>,
        title?: string
    ): ModalRef<D>
    open<D, R>(
        target: ComponentType<unknown> | TemplateRef<unknown>,
        data: D & ModalContainerConfig,
        title?: string
    ): ModalRef<D>
    open<D, R>(
        target: ComponentType<unknown> | TemplateRef<unknown>,
        dataOrTitle: (D & ModalContainerConfig) | (string),
        titleOrNever: string | null = null
    ): ModalRef<D> {
        const data: (D & ModalContainerConfig) = typeof dataOrTitle === "string" ? { } as any : dataOrTitle as any
        const title: string | null = typeof dataOrTitle === "string" ? (dataOrTitle as string) : titleOrNever
        const innerData: unknown = { ...defaultModalConfig, ...data };
        const isMobile = this.platformService.isMobileView;
        const modalRef = new ModalRef(title, data);
        const dialogRef = this.dialog.open(target, {
            panelClass: 'inch-dialog',
            disableClose: true,
            scrollStrategy: new ModalScrollStrategy(),
            container: {
                type: isMobile ? ModalMobileContainerComponent : ModalContainerComponent,
                providers: () => this.getProviders(innerData, () => modalRef),
            },
            providers: () => this.getProviders(innerData, () => modalRef),
            closeOnOverlayDetachments: true,
            data: innerData,
        });
        modalRef.attachRef(dialogRef);
        return modalRef;
    }

    private getProviders<R>(data: unknown, modalRefFactory: () => ModalRef<unknown>): StaticProvider[] {
        return [
            { provide: dataModalToken, useValue: data },
            { provide: refModalToken, useFactory: () => modalRefFactory() },
        ];
    }

}

export class ModalScrollStrategy implements ScrollStrategy {
    private static defaultOverflow: string | null = null;

    private static isEnable = false;

    attach(): void {}

    disable(): void {
        if (!ModalScrollStrategy.isEnable) return;
        document.body.style.overflow = ModalScrollStrategy.defaultOverflow ?? '';
        ModalScrollStrategy.defaultOverflow = null;
        ModalScrollStrategy.isEnable = false;
    }

    enable(): void {
        if (ModalScrollStrategy.isEnable) return;
        ModalScrollStrategy.defaultOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        ModalScrollStrategy.isEnable = true;
    }

}
