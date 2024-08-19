import { IEmbeddedController } from './embedded-controller';
import { TokenType } from '../swap';

export interface ISwapFormEmbeddedController extends IEmbeddedController {
  setToken(tokenType: TokenType, symbol: string): Promise<void>
  setSourceTokenAmount(tokenAmount: string): Promise<void>
}
