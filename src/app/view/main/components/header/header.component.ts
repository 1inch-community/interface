import { ChangeDetectionStrategy, Component } from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {ChainSelectorComponent} from "../chain-selector/chain-selector.component";
import {ConnectWalletComponent} from "../connect-wallet/connect-wallet.component";

@Component({
  selector: 'inch-header',
  standalone: true,
  imports: [
    LogoComponent,
    ChainSelectorComponent,
    ConnectWalletComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inch-header' }
})
export class HeaderComponent {



}
