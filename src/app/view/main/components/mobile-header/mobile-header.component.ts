import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";

@Component({
  selector: 'inch-mobile-header',
  standalone: true,
  imports: [
    LogoComponent
  ],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileHeaderComponent {

}
