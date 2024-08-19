# React Example Application

This application demonstrates how to integrate the 1inch community swap form into your React application.

## Dependency Installation

Before running the application, you need to install the necessary packages. You can do this by running the following command in the project directory:

```bash
npm install
```

## Running the Application

After installing all dependencies, you can start the project with the following command:

```bash
npm start
```

Once the application is running, open the following link in your browser:

[http://localhost:3000](http://localhost:3000)

## Integration Details

You can see the integration code example in the [App.tsx](src/App.tsx) file:

```javascript
import { useEffect } from 'react';
import { bootstrapEmbedded } from 'one-inch-community';

function App() {
  useEffect(() => {
    const initSwapForm = async () => {
      const swapFromController = await bootstrapEmbedded({
        renderContainer: '#container',
        widgetName: 'swap-from',
        themeType: 'dark',
        locale: 'en',
        primaryColor: '#00a0b5',
        walletProvider: window.ethereum,
        chainId: 1,
        swapFromParams: {
          disabledTokenChanging: true,
          sourceTokenSymbol: 'usdt',
          destinationTokenSymbol: 'dai',
        },
      });
    };

    initSwapForm();
  }, []);

  return <div id="container"></div>;
}

export default App;
```

### Parameter Descriptions

- **renderContainer** - The selector of the element where the widget will be displayed.
- **widgetName** - The type of the widget.
- **themeType** - The theme name (`dark` | `light`).
- **locale** - The form's locale. All available locales can be found [here](../../libs/models/src/lib/i18n/i18n-controller.ts).
- **primaryColor** - The primary accent color.
- **walletProvider** - The wallet provider.
- **chainId** - The chain ID.
- **swapFromParams** - Required only when `widgetName === 'swap-from'`. Contains specific settings for the swap form:
    - **disabledTokenChanging** - Flag indicating whether the user can change the selected tokens.
    - **sourceTokenSymbol** & **destinationTokenSymbol** - The symbols of the tokens to be swapped.

### EmbeddedController

After calling `bootstrapEmbedded`, an `EmbeddedController` will be created, which allows you to manage the embedded widget. The `EmbeddedController` includes the following methods and fields:

- **`readonly isDestroyed: boolean`** - A flag indicating whether the widget has been destroyed, which changes after calling `destroy()`.
- **`setChainId(chainId: ChainId): Promise<void>`** - Sends a request to change the chain ID.
- **`setLocale(localeCode: Locale): Promise<void>`** - Changes the widget's locale.
- **`setThemeType(themeType: 'dark' | 'light'): Promise<void>`** - Changes the widget's theme.
- **`setThemePrimaryColor(primaryColor: ColorHex): Promise<void>`** - Changes the widget's accent color.
- **`destroy(): void`** - Destroys the widget.

### SwapFormEmbeddedController

Additionally, if `widgetName === 'swap-from'`, a `SwapFormEmbeddedController` will be created, extending the `EmbeddedController` with the following methods:

- **`setToken(tokenType: TokenType, symbol: string): Promise<void>`** - Allows changing the token.
- **`setSourceTokenAmount(tokenAmount: string): Promise<void>`** - Allows setting the amount for the source token.
