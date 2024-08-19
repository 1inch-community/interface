import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bootstrapEmbedded } from '@one-inch-community/integration-layer/embedded';
import { ColorHex, EmbeddedBootstrapConfig, ISwapFormEmbeddedController, Locale } from '@one-inch-community/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  private swapFromController?: ISwapFormEmbeddedController

  protected Locale = Locale

  protected sourceTokenSymbol = 'usdt'
  protected destinationTokenSymbol = 'usdc'
  protected chainId = '137'
  protected primaryColor: ColorHex = '#73b500'
  protected locale: Locale = Locale.en
  protected _themeType: 'dark' | 'light' = 'dark'
  protected _disabledTokenChanging = true
  protected amount = ''

  protected exampleConfig: unknown

  get themeType() {
    return this._themeType
  }

  set themeType(state: 'dark' | 'light') {
    this._themeType = state
    this.swapFromController?.setThemeType(state).then()
    this.updateExampleConfig()
  }

  get disabledTokenChanging() {
    return this._disabledTokenChanging
  }

  set disabledTokenChanging(state: boolean) {
    this._disabledTokenChanging = state
    this.onDestroy()
    this.onBootstrap().then()
  }

  async ngOnInit() {
    await this.onBootstrap()
  }

  async onBootstrap() {
    if (this.swapFromController) return
    this.swapFromController = await bootstrapEmbedded(this.getConfig());
    this.updateExampleConfig()
  }

  onDestroy() {
    this.swapFromController?.destroy();
    this.swapFromController = undefined
  }

  protected async setSourceTokenSymbol() {
    await this.swapFromController?.setToken('source', this.sourceTokenSymbol)
    this.updateExampleConfig()
  }

  protected async setDestinationTokenSymbol() {
    await this.swapFromController?.setToken('destination', this.destinationTokenSymbol)
    this.updateExampleConfig()
  }

  protected async setChainId() {
    await this.swapFromController?.setChainId(Number(this.chainId))
    this.updateExampleConfig()
  }

  protected async setPrimaryColor() {
    await this.swapFromController?.setThemePrimaryColor(this.primaryColor)
  }

  protected async setAmount() {
    await this.swapFromController?.setSourceTokenAmount(this.amount)
  }

  protected async setLocale() {
    await this.swapFromController?.setLocale(this.locale)
    this.updateExampleConfig()
  }

  private updateExampleConfig() {
    const config: any = this.getConfig()
    config.walletProvider = 'window.ethereum'
    this.exampleConfig = JSON.stringify(config, null, 2)
  }

  private getConfig(): EmbeddedBootstrapConfig {
    return {
      renderContainer: '#container',
      widgetName: 'swap-from',
      oneInchDevPortal: 'https://jellyfish-app-8xwqz.ondigitalocean.app',
      themeType: this.themeType,
      locale: this.locale,
      primaryColor: this.primaryColor,
      walletProvider: window.ethereum,
      chainId: Number(this.chainId),
      swapFromParams: {
        disabledTokenChanging: this.disabledTokenChanging,
        sourceTokenSymbol: this.sourceTokenSymbol,
        destinationTokenSymbol: this.destinationTokenSymbol,
      }
    }
  }
}
