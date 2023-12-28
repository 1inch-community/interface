import { DialogRef } from '@angular/cdk/dialog';
import { BehaviorSubject, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import {ModalAnimation} from "./modal-animation";


export class ModalRef<D = unknown> {

    private readonly animationState$ = new BehaviorSubject<ModalAnimation>(ModalAnimation.enter);

    private readonly titleState$: BehaviorSubject<string | null>;

    private readonly beforeCloseEmitter$: Subject<void> = new Subject();

    get animation$(): Observable<ModalAnimation> {
        return this.animationState$;
    }

    get title$(): Observable<string | null> {
        return this.titleState$;
    }

    get beforeClose$(): Observable<void> {
        return this.beforeCloseEmitter$;
    }

    private ref?: DialogRef;

    constructor(title: string | null, public readonly data: D) {
        this.titleState$ = new BehaviorSubject(title);
    }

    attachRef(ref: DialogRef) {
        if (this.ref) throw new Error('ref in attached');
        ref.backdropClick.pipe(
            tap(() => this.close()),
            take(1),
            takeUntil(this.beforeCloseEmitter$)
        ).subscribe();
        this.ref = ref;
    }

    close() {
        this.animationState$.next(ModalAnimation.leave);
    }

    completeClose() {
        this.ref?.close();
        this.beforeCloseEmitter$.next();
        this.beforeCloseEmitter$.complete();
    }

    changeTitle(title: string) {
        this.titleState$.next(title);
    }
}
