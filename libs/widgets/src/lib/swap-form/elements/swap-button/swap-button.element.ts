import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@one-inch-community/ui-components/button';
import { consume } from '@lit/context';
import { swapContext } from '../../context';
import { ChainId, ISwapContext, IToken } from '@one-inch-community/models';
import {
  combineLatest,
  debounceTime,
  defer,
  distinctUntilChanged,
  firstValueFrom,
  map, Observable,
  of,
  startWith,
  switchMap, tap, merge,
  exhaustMap, withLatestFrom, Subject
} from 'rxjs';
import {
  dispatchEvent,
  getMobileMatchMediaAndSubscribe,
  subscribe
} from '@one-inch-community/lit';
import {
  getAllowance,
  getOneInchRouterV6ContractAddress,
  isChainId,
  isNativeToken,
  isSupportPermit2,
  JsonParser,
  storage,
  hasPermit,
  getBlockEmitter,
  CacheActivePromise
} from '@one-inch-community/sdk';
import { BrandColors, getThemeChange } from '@one-inch-community/ui-components/theme';
import { swapButtonStyle } from './swap-button.style';
import { when } from 'lit/directives/when.js';

enum SwapButtonState {
  readyToSwap,
  readyToSwapLoading,
  unsupportedChain,
  walletNotConnected,
  unselectedSourceToken,
  unselectedDestinationToken,
  zeroAmount,
  exceedingMaximumAmount,
  rateNotExist,
  checkAllowance,
  lowAllowanceNeedApprove,
  lowAllowanceNeedPermit,
  wrapNativeToken,

  permitInWallet,
  approveInWallet
}

const showLoader = [
  SwapButtonState.readyToSwapLoading,
  SwapButtonState.checkAllowance,
  SwapButtonState.permitInWallet,
  SwapButtonState.approveInWallet,
]

@customElement(SwapButtonElement.tagName)
export class SwapButtonElement extends LitElement {
  static tagName = 'inch-swap-button' as const;

  static override styles = swapButtonStyle;

  @consume({ context: swapContext, subscribe: true })
  context?: ISwapContext;

  @state() private isRainbowTheme = false;

  @state() private buttonState: SwapButtonState =  storage.get<SwapButtonState>('fusion_swap_button_state', JsonParser) ?? SwapButtonState.readyToSwap;

  @state() private chainId: ChainId | null = null;

  @state() private srcToken: IToken | null = null;

  private readonly mobileMedia = getMobileMatchMediaAndSubscribe(this);

  private readonly connectedWalletAddress$ = defer(() => this.getConnectedWalletAddress());
  private readonly sourceToken$ = defer(() => this.getSourceToken());
  private readonly destinationToken$ = defer(() => this.getDestinationToken());
  private readonly chainId$ = defer(() => this.getChainId());
  private readonly sourceTokenAmount$ = defer(() => this.getSourceTokenAmount());
  private readonly rate$ = defer(() => this.getRate());
  private readonly block$ = this.chainId$.pipe(
    switchMap(chainId => chainId ? getBlockEmitter(chainId) : [])
  )

  private readonly updateView$ = new Subject<void>()

  private readonly exceedingMaximumAmount$ = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.sourceTokenAmount$.pipe(startWith(0n)),
    merge(
      this.chainId$,
      this.block$
    )
  ]).pipe(
    switchMap(([wallet, sourceToken, amount]) => {
      if (!wallet || !sourceToken || amount === 0n || !this.context) return of(false);
      return this.context.getMaxAmount().then(balance => {
        if (!balance) return false;
        return !amount || amount > balance;
      });
    })
  );

  private readonly calculateStatus$: Observable<SwapButtonState> = combineLatest([
    this.connectedWalletAddress$,
    this.sourceToken$,
    this.destinationToken$,
    this.exceedingMaximumAmount$,
    this.sourceTokenAmount$.pipe(startWith(0n)),
    this.chainId$,
    this.rate$.pipe(startWith(null)),
    this.block$.pipe(startWith(null)),
    this.updateView$.pipe(startWith(null)),
  ]).pipe(
    map( (params) => {
      const [
        walletAddress,
        srcToken,
        dstToken,
        exceedingMaximumAmount,
        amount,
        chainId,
        rate
      ] = params
      this.chainId = chainId
      this.srcToken = srcToken

      if (!isChainId(chainId)) {
        return SwapButtonState.unsupportedChain
      }
      if (walletAddress === null) {
        return SwapButtonState.walletNotConnected
      }
      if (srcToken === null) {
        return SwapButtonState.unselectedSourceToken
      }
      if (dstToken === null) {
        return SwapButtonState.unselectedDestinationToken
      }
      if (!amount || amount === 0n) {
        return SwapButtonState.zeroAmount
      }
      if (exceedingMaximumAmount) {
        return SwapButtonState.exceedingMaximumAmount
      }
      if (rate === null) {
        return SwapButtonState.rateNotExist
      }
      if (isNativeToken(srcToken.address)) {
        return SwapButtonState.wrapNativeToken
      }
      return SwapButtonState.readyToSwap
    }),
    distinctUntilChanged(),
    debounceTime(0),
    withLatestFrom(this.chainId$, this.connectedWalletAddress$, this.sourceToken$),
    exhaustMap(async ([state, chainId, walletAddress, srcToken ]) => {
      if (state !== SwapButtonState.readyToSwap) {
        return state
      }
      if (!chainId || !walletAddress || !srcToken) throw new Error('')
      this.buttonState = SwapButtonState.checkAllowance
      const contract = getOneInchRouterV6ContractAddress(chainId)
      const allowance = await getAllowance(chainId, srcToken.address, walletAddress, contract)
      const amount = await firstValueFrom(this.sourceTokenAmount$)
      if (amount && allowance < amount) {
        if (isSupportPermit2(chainId)) {
          const isHasPermit = await hasPermit(chainId, srcToken.address, walletAddress, contract)
          if (isHasPermit) return state
          return SwapButtonState.lowAllowanceNeedPermit
        }
        return SwapButtonState.lowAllowanceNeedApprove
      }
      return state
    }),
    tap(state => {
      this.buttonState = state
      storage.set('fusion_swap_button_state', this.buttonState)
    })
  );

  override connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      getThemeChange().pipe(
        map(({ brandColor }) => brandColor),
        distinctUntilChanged(),
        tap(color => this.isRainbowTheme = color === BrandColors.rainbow)
      ),
      this.calculateStatus$
    ]);
    this.updateView$.next()
  }

  protected override render() {
    const size = this.mobileMedia.matches ? 'xl' : 'xxl';

    return html`
      <inch-button
        class="smart-hover"
        @click="${(event: MouseEvent) => this.onClickSwapButton(event)}"
        type="${this.getButtonType()}"
        size="${size}"
        loader="${ifDefined(this.getLoaderState())}"
        fullSize
      >
        
        ${when(this.buttonState === SwapButtonState.unsupportedChain, () => html`
          <span class="off-hover">Chain ${this.chainId} not supported</span>
          <span class="on-hover">Change chain</span>
          <br>
        `)}
        ${when(this.buttonState === SwapButtonState.readyToSwap, () => html`<span>Confirm swap</span>`)}
        ${when(this.buttonState === SwapButtonState.readyToSwapLoading, () => html`<span>Confirm swap</span>`)}
        ${when(this.buttonState === SwapButtonState.checkAllowance, () => html`<span>Check allowance</span>`)}
        ${when(this.buttonState === SwapButtonState.wrapNativeToken, () => html`<span>Native token not supported now</span>`)}
        ${when(this.buttonState === SwapButtonState.lowAllowanceNeedApprove, () => html`<span>Approve and Swap</span>`)}
        ${when(this.buttonState === SwapButtonState.lowAllowanceNeedPermit, () => html`<span>Permit and Swap</span>`)}
        ${when(this.buttonState === SwapButtonState.walletNotConnected, () => html`<span>Connect wallet</span>`)}
        ${when(this.buttonState === SwapButtonState.unselectedSourceToken, () => html`<span>Select source token</span>`)}
        ${when(this.buttonState === SwapButtonState.unselectedDestinationToken, () => html`<span>Select destination token</span>`)}
        ${when(this.buttonState === SwapButtonState.zeroAmount, () => html`<span>Enter amount to swap</span>`)}
        ${when(this.buttonState === SwapButtonState.rateNotExist, () => html`<span>No liquidity for swap</span>`)}
        ${when(this.buttonState === SwapButtonState.exceedingMaximumAmount, () => html`
          <span class="off-hover">Insufficient ${this.srcToken?.symbol} balance</span>
          <span class="on-hover">Set max ${this.srcToken?.symbol}</span>
          <br>
        `)}
        ${when(this.buttonState === SwapButtonState.permitInWallet, () => html`
          <span class="off-hover">Wait wallet response</span>
          <span class="on-hover">Permit swap in wallet</span>
          <br>
        `)}
        ${when(this.buttonState === SwapButtonState.approveInWallet, () => html`
          <span class="off-hover">Wait wallet response</span>
          <span class="on-hover">Allow swap in wallet</span>
          <br>
        `)}
      </inch-button>
    `;
  }

  @CacheActivePromise()
  private async onClickSwapButton(event: MouseEvent) {
    if (!this.context) {
      throw new Error('')
    }
    const stateState = this.buttonState
    try {
      if (this.buttonState === SwapButtonState.unsupportedChain) {
        return dispatchEvent(this, 'changeChain', null)
      }
      if (this.buttonState === SwapButtonState.walletNotConnected) {
        return dispatchEvent(this, 'connectWallet', null)
      }
      if (this.buttonState === SwapButtonState.unselectedSourceToken) {
        return dispatchEvent(this, 'openTokenSelector', 'source', event)
      }
      if (this.buttonState === SwapButtonState.unselectedDestinationToken) {
        return dispatchEvent(this, 'openTokenSelector', 'destination', event)
      }
      if (this.buttonState === SwapButtonState.exceedingMaximumAmount) {
        return await this.context.setMaxAmount()
      }
      if (this.buttonState === SwapButtonState.lowAllowanceNeedApprove) {
        this.buttonState = SwapButtonState.approveInWallet
        await this.context.getApprove()
        this.buttonState = SwapButtonState.readyToSwap
      }
      if (this.buttonState === SwapButtonState.lowAllowanceNeedPermit) {
        this.buttonState = SwapButtonState.permitInWallet
        await this.context.getPermit()
        this.buttonState = SwapButtonState.readyToSwap
      }
      if (this.buttonState === SwapButtonState.readyToSwap) {
        this.buttonState = SwapButtonState.readyToSwapLoading
        const snapshot = await this.context.getSnapshot()
        if (snapshot) {
          dispatchEvent(this, 'confirmSwap', snapshot, event)
        }
        this.buttonState = SwapButtonState.readyToSwap
        this.updateView$.next()
      }
    } catch (error) {
      this.buttonState = stateState
    }
  }

  private getButtonType() {
    if (this.buttonState === SwapButtonState.readyToSwap) return 'primary'
    // if (this.buttonState === SwapButtonState.wrapNativeToken) return 'primary'
    if (this.buttonState === SwapButtonState.lowAllowanceNeedApprove) return 'primary'
    if (this.buttonState === SwapButtonState.lowAllowanceNeedPermit) return 'primary'
    return 'secondary'
  }

  private getLoaderState() {
    if (showLoader.includes(this.buttonState)) {
      return true
    }
    return
  }

  private async onSwap() {
    //
  }

  private getConnectedWalletAddress() {
    if (!this.context) throw new Error('');
    return this.context.connectedWalletAddress$;
  }

  private getChainId() {
    if (!this.context) throw new Error('');
    return this.context.chainId$;
  }

  private getSourceToken() {
    if (!this.context) throw new Error('');
    return this.context.getTokenByType('source');
  }

  private getDestinationToken() {
    if (!this.context) throw new Error('');
    return this.context.getTokenByType('destination');
  }

  private getSourceTokenAmount() {
    if (!this.context) throw new Error('');
    return this.context.getTokenRawAmountByType('source');
  }

  private getRate() {
    if (!this.context) throw new Error('');
    return this.context.rate$;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-swap-button': SwapButtonElement;
  }
}
