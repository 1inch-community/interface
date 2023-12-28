import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {ButtonComponent, NgLet} from "@1inch/v3/view/shared";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {SwapButtonState, SwapButtonStateService} from '../../services/swap-button-state.service';

const disabledStates: SwapButtonState[]  = [
  SwapButtonState.overflowBalance,
  SwapButtonState.zeroAmount,
  SwapButtonState.updateDstTokenAmount,
  SwapButtonState.lowLiquidity
]

const loadStates: SwapButtonState[]  = [
  SwapButtonState.updateDstTokenAmount
]

const buttonText: Record<SwapButtonState, string | ((symbol: string) => string)> = {
  [SwapButtonState.ready]: 'Swap',
  [SwapButtonState.zeroAmount]: 'Enter amount to swap',
  [SwapButtonState.walletNotConnected]: 'Connect wallet',
  [SwapButtonState.discrepanciesChainId]: 'Chain Id in dApp and in wallet do not match',
  [SwapButtonState.dstTokenNotSelect]: 'Select destination token',
  [SwapButtonState.overflowBalance]: (symbol) => `Insufficient ${symbol} balance`,
  [SwapButtonState.wrapNativeToken]: 'Wrap native token & Swap',
  [SwapButtonState.needAllowance]: 'Get allowance & Swap',
  [SwapButtonState.updateDstTokenAmount]: 'Update destination token amount',
  [SwapButtonState.lowLiquidity]: 'Amount of source tokens is too low',
}

@Component({
  selector: 'inch-swap-button',
  standalone: true,
  imports: [
    ButtonComponent,
    AsyncPipe,
    NgLet,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './swap-button.component.html',
  styleUrl: './swap-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwapButtonComponent {

  @Output() swap = new EventEmitter<void>()
  @Output() connectWallet = new EventEmitter<void>()
  @Output() chainChainId = new EventEmitter<void>()
  @Output() wrapNativeToken = new EventEmitter<void>()
  @Output() selectDstToken = new EventEmitter<void>()
  @Output() getAllowance = new EventEmitter<void>()

  protected readonly stateService = inject(SwapButtonStateService)

  protected readonly SwapButtonState = SwapButtonState

  private readonly emitter: Record<SwapButtonState, EventEmitter<void> | null> = {
    [SwapButtonState.ready]: this.swap,
    [SwapButtonState.zeroAmount]: null,
    [SwapButtonState.walletNotConnected]: this.connectWallet,
    [SwapButtonState.discrepanciesChainId]: this.chainChainId,
    [SwapButtonState.dstTokenNotSelect]: this.selectDstToken,
    [SwapButtonState.updateDstTokenAmount]: null,
    [SwapButtonState.overflowBalance]: null,
    [SwapButtonState.wrapNativeToken]: this.wrapNativeToken,
    [SwapButtonState.needAllowance]: this.getAllowance,
    [SwapButtonState.lowLiquidity]: null,
  }

  protected onClock(state: SwapButtonState | null) {
    if (!state) return
    const emitter = this.emitter[state]
    if (!emitter) return
    emitter.emit()
  }

  protected isShowLoader(state: SwapButtonState | null): boolean {
    const customLoadingState = this.stateService.getLoadingState()
    if (customLoadingState) {
      return customLoadingState
    }
    if (!state) return false
    return loadStates.includes(state)
  }

  protected getColor(state: SwapButtonState | null): any {
    if (state === SwapButtonState.walletNotConnected) return 'blue'
    return 'default'
  }

  protected getText(state: SwapButtonState | null) {
    const customText = this.stateService.getButtonText()
    if (customText) return customText
    if (!state) return ''
    const text = buttonText[state]
    if (typeof text === "string") return text
    return text(this.stateService.srcTokenSymbol)
  }

  protected isDisabled(state: SwapButtonState | null): boolean {
    const customLoadingState = this.stateService.getLoadingState()
    if (customLoadingState) {
      return customLoadingState
    }
    if (!state) return true
    return disabledStates.includes(state)
  }

}
