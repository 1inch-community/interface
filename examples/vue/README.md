# Vue Example Application

This application demonstrates how to integrate the 1inch community swap form into your Vue.js application.

## Dependency Installation

Before running the application, you need to install the necessary packages. You can do this by running the following command in the project directory:

```bash
pnpm install
```

## Running the Application

After installing all dependencies, you can start the project with the following command:

```bash
pnpm run serve
```

Once the application is running, open the following link in your browser:

[http://localhost:8080](http://localhost:8080)

## Integration Details

You can see the integration code example in the [HelloWorld.vue](src/components/HelloWorld.vue) file:

```vue
<template>
  <div id="container"></div>
</template>

<script>
import { bootstrapEmbedded } from 'one-inch-community';

export default {
  name: 'App',
  mounted() {
    this.initSwapForm();
  },
  methods: {
    async initSwapForm() {
      const swapFromController = await bootstrapEmbedded({
        renderContainer: '#container',
        widgetName: 'swap-from',
        themeType: 'dark',
        locale: 'en',
        primaryColor: '#00a0b5',
        walletProvider: window.ethereum,
        chainId: 1,
        oneInchDevPortal: '{{ proxy host }}',
        swapFromParams: {
          disabledTokenChanging: true,
          sourceTokenSymbol: 'usdt',
          destinationTokenSymbol: 'dai',
        },
      });
    },
  },
};
</script>

<style>
/* Add your styles here */
</style>
```

### Parameter Descriptions

- **renderContainer** - The selector of the element where the widget will be displayed.
- **widgetName** - The type of the widget.
- **themeType** - The theme name (`dark` | `light`).
- **locale** - The form's locale. All available locales can be found [here](../../libs/models/src/lib/i18n/i18n-controller.ts).
- **primaryColor** - The primary accent color.
- **walletProvider** - The wallet provider.
- **chainId** - The chain ID.
- **oneInchDevPortal** - parameter receiving or url proxy or api Key or object with url proxy and apiKey at the same time
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
