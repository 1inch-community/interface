import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {ChainSelectorComponent} from "../chain-selector/chain-selector.component";
import {ConnectWalletComponent} from "../connect-wallet/connect-wallet.component";

@Component({
  selector: 'inch-mobile-footer',
  standalone: true,
  imports: [
    LogoComponent,
    ChainSelectorComponent,
    ConnectWalletComponent
  ],
  templateUrl: './mobile-footer.component.html',
  styleUrl: './mobile-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileFooterComponent {

}
