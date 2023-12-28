import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {PlatformService} from "@1inch/v3/view/shared";

@Component({
  selector: 'inch-logo',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {

  protected readonly platform = inject(PlatformService)

}
