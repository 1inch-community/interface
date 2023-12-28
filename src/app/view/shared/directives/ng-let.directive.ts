import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";

interface NgLetContext<T> {
    ngLet: T;
    $implicit: T;
}

@Directive({
    selector: '[ngLet]',
    standalone: true
})
export class NgLet<T> {

    private context: NgLetContext<T | null> = { ngLet: null, $implicit: null };
    private hasView = false;

    constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<NgLetContext<T>>) { }

    @Input()
    set ngLet(value: T) {
        this.context.$implicit = this.context.ngLet = value;
        if (!this.hasView) {
            this.hasView = true;
            this.viewContainer.createEmbeddedView(this.templateRef, this.context);
        }
    }

    /** @internal */
    public static ngLetUseIfTypeGuard: void;
    static ngTemplateGuard_ngLet: 'binding';

    static ngTemplateContextGuard<T>(dir: NgLet<T>, ctx: any): ctx is NgLetContext<T> {
        return true;
    }
}
