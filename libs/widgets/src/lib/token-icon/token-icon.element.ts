import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import type { Address } from 'viem';
import { repositories } from './repositories';
import { RepositoryPayload } from './repositories/repository.model';
import { ChainId, IToken } from '@one-inch-community/models';
import { getWrapperNativeToken, isNativeToken, TokenController } from '@one-inch-community/sdk';

@customElement(TokenIconElement.tagName)
export class TokenIconElement extends LitElement {
  static tagName = 'inch-token-icon' as const

  static override styles = css`

      :host {
          user-select: none;
          outline: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
      }

      .stub {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-background-bg-secondary);
          border-radius: 50%;
          color: var(--color-content-content-secondary);
          position: relative;
      }
      .stub-loader {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid;
          border-bottom-color: var(--secondary);
          border-top-color: var(--secondary);
          animation: spin 1s linear infinite;
      }
      
      img {
          user-select: none;
          outline: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
      }

      @keyframes spin {
          0% {
              transform: rotate(0deg);
          }

          100% {
              transform: rotate(360deg);
          }
      }
  
  `

  @property({ type: String, attribute: true }) symbol?: string
  @property({ type: String, attribute: true }) address?: Address
  @property({ type: Number, attribute: true }) chainId?: ChainId
  @property({ type: Number, attribute: true }) size = 24

  private readonly task = new Task(this, {
    task: ([symbol, address, chainId], { signal }) => {
      return iconLoader(signal, chainId, symbol, address)
    },
    args: () => [this.symbol, this.address, this.chainId] as [string | undefined, Address | undefined, number | undefined]
  })

  protected override render() {
    return this.task.render({
      error: () => symbolView(this.size, this.symbol),
      pending: () => symbolView(this.size, this.symbol, true),
      initial: () => symbolView(this.size, this.symbol, true),
      complete: value => {
        value.width = this.size;
        value.height = this.size;
        value.ondragstart = () => false
        return html `${value}`;
      }
    });
  }

  protected override updated() {
    this.style.width = `${this.size}px`
    this.style.height = `${this.size}px`
  }

}

function symbolView(size: number, symbol?: string, showLoader?: boolean) {
  return html`
    <div style="width: ${size}px; height: ${size}px; font-size: ${size < 40 ? 13 : 16}px" class="stub">
      <span>${symbol?.slice(0, size < 40 ? 1 : 2) ?? ''}</span>
      ${showLoader ? html`<span class="stub-loader"></span>` : ''}
    </div>
  `;
}

async function iconLoader(signal: AbortSignal, chainId?: ChainId, symbol?: string, address?: Address): Promise<HTMLImageElement> {
  let result = await loadFromDatabase({ chainId, symbol, address, signal });
  if (result === null) {
    result = await loadFromRepository({ chainId, symbol, address, signal });
  }
  if (result === null) {
    result = await loadIconFromMultiChain({ chainId, symbol, address, signal })
  }
  if (result === null) {
    throw new Error('token icon not fount');
  }
  return result
}

async function loadFromDatabase(data: RepositoryPayload): Promise<HTMLImageElement | null> {
  if (!data.chainId || !data.address) {
    return null
  }
  const token = await TokenController.getToken(data.chainId, data.address)
  if (!token || !token.logoURL) {
    return null
  }
  return await new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(null)
    img.onload = () => resolve(img)
    img.src = token.logoURL
  })
}

async function loadFromRepository(data: RepositoryPayload, index = 0): Promise<HTMLImageElement | null> {
  const repositoryLoader = repositories[index];
  if (!repositoryLoader) return null;
  try {
    const repository = await repositoryLoader();
    return await repository(data)
  } catch (error) {
    return await loadFromRepository(data, index + 1);
  }
}

async function loadIconFromMultiChain(data: RepositoryPayload): Promise<HTMLImageElement | null> {
  if (data.chainId === ChainId.eth || !data.symbol) return null
  const tokens: IToken[] = await TokenController.getTokenBySymbol(ChainId.eth, data.symbol)
  if (data.chainId && data.address && isNativeToken(data.address)) {
    const wrapToken = getWrapperNativeToken(data.chainId)
    tokens.push(wrapToken)
  }
  for (const token of tokens) {
    const result = await loadFromRepository({ ...data, chainId: token.chainId, address: token.address })
    if (result) return result
  }
  return null
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-token-icon': TokenIconElement
  }
}
