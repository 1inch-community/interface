import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'button[inch-button]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  @Input() size: 'none' | 's' | 'm' | 'l' = 'm'

  @Input() color: 'none' | 'default' | 'blue' | 'flat' = 'default'

  @Input() fullWidth: boolean = false

  @Input() contentCenter: boolean = false

  protected classPrefix = 'inch-button'

  @HostBinding('class')
  protected get sizeClass() {
    return [
      this.classPrefix,
      `${this.classPrefix}__size-${this.size}`,
      `${this.classPrefix}__color-${this.color}`,
      this.fullWidth ? `${this.classPrefix}__color-full-width` : '',
      this.contentCenter ? `${this.classPrefix}__color-content-center` : ''
    ].join(' ')
  }

}
