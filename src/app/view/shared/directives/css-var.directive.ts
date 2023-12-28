import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[inchCssVar]',
  standalone: true
})
export class CssVar implements OnChanges {

  @Input('cssVarName') name?: string

  @Input('cssVarValue') value?: string

  constructor(private el: ElementRef<HTMLElement>) {
  }

  ngOnChanges(): void {
    if (!this.name || !this.value) return
    this.el.nativeElement.style.setProperty(`--${this.name}`, this.value)
  }

}
