import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { notificationFusionSwapViewStyles } from './notification-fusion-swap-view.styles';
import { Address, formatUnits, Hash } from 'viem';
import { Task, TaskStatus } from '@lit/task';
import { consume } from '@lit/context';
import { ChainId, IApplicationContext, IToken } from '@one-inch-community/models';
import { ApplicationContextToken } from '@one-inch-community/core/application-context';
import type { OrderStatusResponse } from '@1inch/fusion-sdk';
import { ifDefined } from 'lit/directives/if-defined.js';
import { smartFormatNumber } from '@one-inch-community/core/formatters';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { subscribe, translate } from '@one-inch-community/core/lit';
import { getBlockEmitter } from '@one-inch-community/sdk/chain';
import { tap } from 'rxjs';

import("@one-inch-community/widgets/token-icon")
import("@one-inch-community/ui-components/timer")

type TaskResult = [
  OrderStatusResponse,
  IToken | null,
  IToken | null
]

enum OrderStatus {
  Pending = "pending",
  Filled = "filled",
  FalsePredicate = "false-predicate",
  NotEnoughBalanceOrAllowance = "not-enough-balance-or-allowance",
  Expired = "expired",
  PartiallyFilled = "partially-filled",
  WrongPermit = "wrong-permit",
  Cancelled = "cancelled",
  InvalidSignature = "invalid-signature"
}

@customElement(NotificationFusionSwapViewElement.tagName)
export class NotificationFusionSwapViewElement extends LitElement {
  static readonly tagName = 'inch-notification-fusion-swap-view' as const

  static override styles = notificationFusionSwapViewStyles

  @property({ type: String }) orderHash?: Hash

  @consume({ context: ApplicationContextToken })
  applicationContext!: IApplicationContext

  private chainId?: ChainId

  private readonly task = new Task(
    this,
    async ([ orderHash ]): Promise<TaskResult> => {
      const chainId = this.chainId ?? (await this.applicationContext.connectWalletController.data.getChainId())
      if (!chainId || !orderHash) throw new Error('')
      if (!this.chainId) {
        this.startUpdate(chainId)
      }
      this.chainId = chainId
      const status = await this.applicationContext.oneInchDevPortalAdapter.getFusionOrderStatus(chainId, orderHash)
      if ('statusCode' in status) {
        throw status
      }
      if (this.task.value !== undefined) {
        const sourceToken: IToken | null = this.task.value[1]
        const destinationToken: IToken | null = this.task.value[2]
        return [ status, sourceToken, destinationToken ] as const
      }
      const [ sourceToken, destinationToken ] = await Promise.all([
        this.applicationContext.tokenController.getToken(chainId, status.order.makerAsset as Address),
        this.applicationContext.tokenController.getToken(chainId, status.order.takerAsset as Address)
      ])
      return [ status, sourceToken, destinationToken ] as const
    },
    () => [ this.orderHash ] as const
  )

  protected render() {
    return this.task.render({
      complete: ([ status, sourceToken, destinationToken ]) => this.onCompleteView(
        status, sourceToken, destinationToken
      ),
      pending: () => this.onPendingView(),
      error: (error: unknown) => this.onErrorView(error),
    })
  }

  private onCompleteView(status: OrderStatusResponse, sourceToken: IToken | null, destinationToken: IToken | null) {
    const chainId = this.chainId
    if (!sourceToken || !destinationToken || !chainId) return html``
    const sourceTokenAmount = BigInt(status.order.makingAmount)
    const destinationTokenAmount = BigInt(status.order.takingAmount)
    return html`
      <div class="status-view-container">
        <div class="token-icon-container">
          <inch-token-icon
            class="source-token-icon"
            symbol="${ifDefined(sourceToken?.symbol)}"
            address="${ifDefined(sourceToken?.address)}"
            .chainId="${chainId}"
          ></inch-token-icon>
          <inch-token-icon
            class="destination-token-icon"
            symbol="${ifDefined(destinationToken?.symbol)}"
            address="${ifDefined(destinationToken?.address)}"
            .chainId="${chainId}"
          ></inch-token-icon>
        </div>
        <div>
          <div class="amount-status-view">
            ${smartFormatNumber(formatUnits(sourceTokenAmount, sourceToken.decimals), 2)}
            <span class="symbol-view">${sourceToken?.symbol}</span>
            →
            ${smartFormatNumber(formatUnits(destinationTokenAmount, destinationToken.decimals), 2)}
            <span class="symbol-view">${destinationToken?.symbol}</span>
          </div>
          <div class="swap-status-view">
            ${this.getStatusView(status)}
          </div>
        </div>
      </div>
    `
  }

  private onPendingView() {
    return html`
      <div class="loading-view">
        <div class="loader"></div>
        <div>Update order status</div>
      </div>
    `
  }

  private onErrorView(error: unknown) {
    if (
      typeof error === 'object'
      && error !== null
      && ('statusCode' in error)
      && typeof error.statusCode === 'number'
      && error.statusCode >= 400
      && error.statusCode < 500
    ) {
      return html`
      <div class="error-view">
        <div>Swap not found</div>
      </div>
    `
    }
    return html`
      <div class="error-view">
        <div>Error load swap status</div>
      </div>
    `
  }

  private getStatusView(status: OrderStatusResponse) {
    const statusText: string = status.status
    const classes = {
      'status-view': true,
      ['status-view__' + statusText]: true
    }
    const expirationTime = (status.auctionStartDate + status.auctionDuration) * 1000
    // const statusText = status.status
    return html`
      <div class="status-container">
        <div class="${classMap(classes)}">
          ${translate(`widgets.notifications.fusion-swap-view.status.${statusText}`)}
        </div>
        ${when(statusText === OrderStatus.Pending || statusText === OrderStatus.PartiallyFilled, () => html`
         <span><inch-timer expirationTime="${expirationTime}"></inch-timer></span>
        `)}
      </div>
    `
  }

  private startUpdate(chainId: ChainId) {
    subscribe(this, [
      getBlockEmitter(chainId).pipe(
        tap(() => {
          if (this.task.status !== TaskStatus.COMPLETE || !this.task.value) return
          const status = this.task.value[0]
          if (status.status !== OrderStatus.Pending && status.status !== OrderStatus.PartiallyFilled) return
          this.task.run([ this.orderHash ]).catch(console.error)
        })
      )
    ], { requestUpdate: false })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-notification-fusion-swap-view': NotificationFusionSwapViewElement
  }
}
