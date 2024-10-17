import React, { ChangeEvent, Dispatch, useEffect, useRef, useState } from 'react';
import {
  EmbeddedBootstrapConfig,
  EmbeddedBootstrapConfigBase,
  ISwapFormEmbeddedController,
  Locale
} from '@one-inch-community/models';
import { bootstrapEmbedded } from '@one-inch-community/integration-layer/embedded';
import './App.css';

function App() {

  const [swapController, setSwapController] = useState<ISwapFormEmbeddedController | null>(null);
  const [configView, setConfigView] = useState<string>();
  const [themeType, setThemeType] = useState<EmbeddedBootstrapConfigBase['themeType']>('dark');
  const [locale, setLocale] = useState<EmbeddedBootstrapConfigBase['locale']>(Locale.en);
  const [primaryColor, setPrimaryColor] = useState<EmbeddedBootstrapConfigBase['primaryColor']>('#73b500');
  const [chainId, setChainId] = useState<EmbeddedBootstrapConfigBase['chainId']>(137);
  const [sourceTokenSymbol, setSourceTokenSymbol] = useState<string>('usdc');
  const [destinationTokenSymbol, setDestinationTokenSymbol] = useState<string>('usdt');
  const [amount, setAmount] = useState<string>('');
  const [disabledTokenChanging, setDisabledTokenChanging] = useState<boolean>(true);

  const disabledTokenChangingRef = useRef<boolean>(disabledTokenChanging);
  const themeTypeRef = useRef<EmbeddedBootstrapConfigBase['themeType']>(themeType);

  const getConfig = (): EmbeddedBootstrapConfig => ({
    themeType,
    locale,
    primaryColor,
    chainId,
    oneInchDevPortal: 'https://jellyfish-app-8xwqz.ondigitalocean.app',
    renderContainer: '#container',
    widgetName: 'swap-from',
    walletProvider: window.ethereum,
    swapFromParams: {
      sourceTokenSymbol,
      destinationTokenSymbol,
      disabledTokenChanging
    }
  });

  const destroy = () => {
    swapController?.destroy();
    setSwapController(null);
  };

  const bootstrap = () => {
    let isCancel = false;
    const handler = async () => {
      if (swapController && !swapController.isDestroyed) return;
      const config = getConfig();
      const controller = await bootstrapEmbedded(config);
      if (isCancel) {
        controller.destroy();
        return;
      }
      setSwapController(controller);
      updateConfigView();
    };
    handler().then();
    return () => {
      isCancel = true;
    };
  };

  const updateConfigView = () => {
    const config: any = getConfig();
    config.walletProvider = 'window.ethereum';
    const configView = JSON.stringify(config, null, 2);
    setConfigView(configView);
  };

  const changeHandler = (setter: Dispatch<any>) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setter(event.target.value);
  }

  useEffect(() => {
    return bootstrap();
  }, []);

  useEffect(() => {
    if (disabledTokenChangingRef.current === disabledTokenChanging) return
    destroy()
    const handler = bootstrap()
    disabledTokenChangingRef.current = disabledTokenChanging
    updateConfigView()
    return handler
  }, [disabledTokenChanging])

  useEffect(() => {
    if (themeType === themeTypeRef.current) return
    swapController?.setThemeType(themeType).then()
    themeTypeRef.current = themeType
    updateConfigView()
  }, [ themeType ])

  return (
    <div className="main">
      <div>
        <div id="container"></div>
        <textarea
          value={configView}
          className="config-view"
          readOnly={true}
        >
      </textarea>
      </div>

      <div className="controls">
        <button onClick={() => destroy()}>Destroy</button>
        <button onClick={() => bootstrap()}>Bootstrap</button>

        <label className="input">
          <span>source token symbol</span>
          <input value={sourceTokenSymbol} onChange={changeHandler(setSourceTokenSymbol)}
                 placeholder="source token symbol" />
        </label>
        <button onClick={async () => {
          await swapController?.setToken('source', sourceTokenSymbol)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>destination token symbol</span>
          <input value={destinationTokenSymbol} onChange={changeHandler(setDestinationTokenSymbol)}
                 placeholder="destination token symbol" />
        </label>
        <button onClick={async () => {
          await swapController?.setToken('destination', destinationTokenSymbol)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>amount</span>
          <input value={amount} onChange={changeHandler(setAmount)}
                 placeholder="amount" />
        </label>
        <button onClick={async () => {
          await swapController?.setSourceTokenAmount(amount)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>chain id</span>
          <input value={chainId} onChange={changeHandler(setChainId)}
                 placeholder="chain id" />
        </label>
        <button onClick={async () => {
          await swapController?.setChainId(chainId)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>primary color</span>
          <input value={primaryColor} onChange={changeHandler(setPrimaryColor)}
                 placeholder="primary color" />
        </label>
        <button onClick={async () => {
          await swapController?.setThemePrimaryColor(primaryColor)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>locale</span>
          <select value={locale} onChange={changeHandler(setLocale)} name="locale">
            <option value={Locale.en}>{Locale.en}</option>
            <option value={Locale.fr}>{Locale.fr}</option>
            <option value={Locale.ar}>{Locale.ar}</option>
            <option value={Locale.de}>{Locale.de}</option>
            <option value={Locale.es}>{Locale.es}</option>
          </select>
        </label>
        <button onClick={async () => {
          await swapController?.setLocale(locale)
          updateConfigView()
        }}>Set
        </button>

        <label className="input">
          <span>disabled change token</span>
        </label>
        <input type="checkbox" checked={disabledTokenChanging} onChange={(event) => {
          setDisabledTokenChanging(event.target.checked);
        }} placeholder="disabled change token" />

        <span>theme</span>

        <div>
          <span>dark</span>
          <input type="radio" value="dark" checked={themeType === 'dark'} onChange={changeHandler(setThemeType)} />

          <span>light</span>
          <input type="radio" value="light" checked={themeType === 'light'} onChange={changeHandler(setThemeType)} />
        </div>

      </div>
    </div>
  )
    ;
}

export default App;
