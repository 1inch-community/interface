import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appStyle } from './app.style';
import './elements/header';
import './elements/footer';
import { Router, Resolver, Route } from '@vaadin/router';
import { scrollbarStyle } from '@one-inch-community/ui-components/theme';
import { getChainById, getChainIdFromStorage } from '@one-inch-community/sdk';
import { ChainId } from '@one-inch-community/models';
import { ContextProvider } from '@lit/context';
import { routerContext } from './contexts';
import {
  lazy,
  actions,
  chainIdValidator,
  sourceTokenValidation,
  destinationTokenValidation,
  updateViewIfChangePathParams,
} from './router-actions';
import './elements/swap-form';

@customElement('app-root')
export class AppElement extends LitElement {

  private readonly routerContext = new ContextProvider(this, { context: routerContext });

  protected async firstUpdated() {
    const resolver = new Resolver([

    ] as Route[])
    const router = new Router(this.shadowRoot?.querySelector('#outlet'));
    this.routerContext.setValue(router);
    const chainIdByDefault = getChainIdFromStorage() ?? ChainId.eth;
    const chain = getChainById(chainIdByDefault);
    const tokenSymbolByDefault = chain.nativeCurrency.symbol;
    await router.setRoutes([
      {
        path: '/:chainId',
        action: chainIdValidator,
        children: [
          {
            path: '/swap',
            action: lazy(() => import('./elements/swap-form')),
            children: [
              {
                path: '/:sourceToken',
                component: 'inch-swap-form-page',
                action: actions([
                  sourceTokenValidation,
                  updateViewIfChangePathParams
                ])
              },
              {
                path: '/:sourceToken/:destinationToken',
                component: 'inch-swap-form-page',
                action: actions([
                  sourceTokenValidation,
                  destinationTokenValidation,
                  updateViewIfChangePathParams
                ])
              }
            ]
          }
        ]
      },
      {
        path: '(.*)',
        redirect: `${chainIdByDefault}/swap/${tokenSymbolByDefault}`
      }
    ]);
  }

  static override styles = [
    appStyle,
    scrollbarStyle
  ];

  protected render() {
    return html`
      <inch-header></inch-header>
      <div id="outlet" class="content"></div>
      <inch-footer></inch-footer>
    `;
  }
}
