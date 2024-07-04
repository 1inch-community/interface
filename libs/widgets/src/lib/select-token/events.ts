import { IToken } from '@one-inch-community/models'
import { dispatchEvent } from '@one-inch-community/core/lit'

export function emitSelectTokenEvent(ctx: HTMLElement, value: IToken, event?: Event) {
  dispatchEvent(ctx, 'selectToken', value, event)
}
