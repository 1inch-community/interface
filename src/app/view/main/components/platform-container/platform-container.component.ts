import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {PlatformService} from "@1inch/v3/view/shared";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {MobileHeaderComponent} from "../mobile-header/mobile-header.component";
import {MobileFooterComponent} from "../mobile-footer/mobile-footer.component";

@Component({
  selector: 'inch-platform-container',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    MobileHeaderComponent,
    MobileFooterComponent,
    NgTemplateOutlet
  ],
  templateUrl: './platform-container.component.html',
  styleUrl: './platform-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformContainerComponent {

  protected readonly platform = inject(PlatformService)
}
