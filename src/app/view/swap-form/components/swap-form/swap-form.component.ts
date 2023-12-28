import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CardComponent} from "../card/card.component";
import {SwapFormPairComponent} from "../swap-form-pair/swap-form-pair.component";
import {SwapButtonComponent} from "../swap-button/swap-button.component";
import {WalletConnectionComponent} from "../../../main/modal-components/wallet-connection/wallet-connection.component";
import {ModalService} from "@1inch/v3/view/shared";
import {ContractAddresses, Contracts, RouteHelperService} from "@1inch/v3/core/shared";
import {TransactionService} from "../../../../core/wallet/services/transaction.service";
import {SwapFormDataService} from "../../services/swap-form-data.service";
import {firstValueFrom} from "rxjs";
import {parseUnits} from "viem";
import {isNativeTokenContract, waitTransaction} from "@1inch/v3/core/wallet";
import {SwapButtonStateService} from "../../services/swap-button-state.service";
import {FusionSwapAdapter} from "@1inch/v3/core/swap";

@Component({
  selector: 'inch-swap-form',
  standalone: true,
  imports: [
    CardComponent,
    SwapFormPairComponent,
    SwapButtonComponent
  ],
  templateUrl: './swap-form.component.html',
  styleUrl: './swap-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SwapButtonStateService
  ]
})
export class SwapFormComponent {

  private readonly modal = inject(ModalService)
  private readonly routeHelperService = inject(RouteHelperService)
  private readonly swapFormDataService = inject(SwapFormDataService)
  private readonly transactionService = inject(TransactionService)
  private readonly buttonStateService = inject(SwapButtonStateService)
  private readonly fusionAdapter = inject(FusionSwapAdapter)

  protected onConnectWallet() {
    this.modal.open(WalletConnectionComponent, 'Wallet connect')
  }

  protected onChainChainId() {

  }

  protected async onSelectDstToken() {
    await this.routeHelperService.openSelectToken("dstToken")
  }

  protected async onWrapNativeToken() {
    try {
      const amountRaw = await firstValueFrom(this.swapFormDataService.srcTokenAmountRaw$)
      const token = await firstValueFrom(this.swapFormDataService.srcToken$)
      const chainId = await firstValueFrom(this.swapFormDataService.chainId$)
      if (!token) return
      const amount = parseUnits(amountRaw, token.decimals)
      this.buttonStateService.setLoadingState(true)
      this.buttonStateService.setButtonText('Confirm transaction from wallet')
      const hash = await this.transactionService.wrapNativeToken(amount)
      this.buttonStateService.setButtonText(`Wrap ${token.symbol}`)
      await waitTransaction(hash, chainId)
    } catch (error) {
      this.buttonStateService.resetButtonText()
      this.buttonStateService.setLoadingState(false)
    }
    await this.swap()
  }

  protected async onGetAllowance() {
    try {
      const token = await firstValueFrom(this.swapFormDataService.srcToken$)
      const chainId = await firstValueFrom(this.swapFormDataService.chainId$)
      if (!token) return
      this.buttonStateService.setLoadingState(true)
      if (!isNativeTokenContract(token.address)) {
        this.buttonStateService.setButtonText('Confirm transaction from wallet')
        const hash = await this.transactionService.approve(token, ContractAddresses[Contracts.OneInchRouterV5])
        this.buttonStateService.setButtonText(`Waiting approve transaction`)
        await waitTransaction(hash, chainId)
      }
    } catch {
      this.buttonStateService.resetButtonText()
      this.buttonStateService.setLoadingState(false)
    }
    await this.swap()
  }

  async swap() {
    try {
      const srcToken = await firstValueFrom(this.swapFormDataService.srcToken$)
      const dstToken = await firstValueFrom(this.swapFormDataService.dstToken$)
      if (!srcToken || !dstToken) {
        throw new Error('Source token of destination token not selected')
      }
      this.buttonStateService.setLoadingState(true)
      this.buttonStateService.setButtonText('Confirm transaction from wallet')
      const chainId = await firstValueFrom(this.swapFormDataService.chainId$)
      const srcTokenAmountRaw = await firstValueFrom(this.swapFormDataService.srcTokenAmountRaw$)
      const amount = parseUnits(srcTokenAmountRaw, srcToken.decimals)
      await this.fusionAdapter.swap(
        chainId,
        srcToken,
        dstToken,
        amount
      )
    } catch (error) {
      console.error(error)
    }
    this.buttonStateService.resetButtonText()
    this.buttonStateService.setLoadingState(false)
  }

}
