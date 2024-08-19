import { ISwapFormEmbeddedController, TokenType, __ISwapFormEmbeddedController } from '@one-inch-community/models';
import { BaseEmbeddedController } from './base-embedded-controller';
import { parseUnits } from 'viem';
import { firstValueFrom } from 'rxjs';
import { safeContextMap } from './safe-context';
import EventEmitter from 'eventemitter3';

export class SwapFormEmbeddedController extends BaseEmbeddedController implements ISwapFormEmbeddedController, __ISwapFormEmbeddedController {
  readonly emitter: EventEmitter<'changeChain' | 'connectWallet', void> = new EventEmitter();

  onChangeChain(callback: () => void): void {
    this.emitter.on('changeChain', () => callback());
  }

  onConnectWallet(callback: () => void): void {
    this.emitter.on('connectWallet', () => callback());
  }

  async setToken(tokenType: TokenType, symbol: string) {
    const safeContext = safeContextMap.get(this)!;
    const swapContext = safeContext.context.getActiveSwapContext();
    if (!swapContext) return;
    const chainId = await safeContext.context.connectWalletController.data.getChainId();
    if (chainId === null) throw new Error('Chain id is not set');
    const tokenList = await safeContext.context.tokenController.getTokenBySymbol(chainId, symbol.toUpperCase());
    if (tokenList.length === 0) throw new Error(`token with symbol ${symbol} not found`);
    swapContext.setToken(tokenType, tokenList[0]);
  }

  async setSourceTokenAmount(tokenAmount: string): Promise<void> {
    const safeContext = safeContextMap.get(this)!;
    const swapContext = safeContext.context.getActiveSwapContext();
    if (!swapContext) return;
    const token = await firstValueFrom(swapContext.getTokenByType('source'));
    if (!token) return;
    const amount = parseUnits(tokenAmount, token.decimals);
    swapContext.setTokenAmountByType('source', amount, true);
  }
}
