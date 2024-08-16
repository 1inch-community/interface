<template>
  <div class="main">
    <div>
      <div id="container"></div>
      <textarea v-model="configView" class="config-view" readonly></textarea>
    </div>

    <div class="controls">
      <button @click="destroy">Destroy</button>
      <button @click="bootstrap">Bootstrap</button>

      <label class="input">
        <span>source token symbol</span>
        <input v-model="sourceTokenSymbol" placeholder="source token symbol" />
      </label>
      <button @click="setSourceTokenSymbolHandler">Set</button>

      <label class="input">
        <span>destination token symbol</span>
        <input v-model="destinationTokenSymbol" placeholder="destination token symbol" />
      </label>
      <button @click="setDestinationTokenSymbolHandler">Set</button>

      <label class="input">
        <span>amount</span>
        <input v-model="amount" placeholder="amount" />
      </label>
      <button @click="setAmountHandler">Set</button>

      <label class="input">
        <span>chain id</span>
        <input v-model="chainId" placeholder="chain id" />
      </label>
      <button @click="setChainIdHandler">Set</button>

      <label class="input">
        <span>primary color</span>
        <input v-model="primaryColor" placeholder="primary color" />
      </label>
      <button @click="setPrimaryColorHandler">Set</button>

      <label class="input">
        <span>locale</span>
        <select v-model="locale">
          <option v-for="loc in locales" :value="loc" :key="loc">{{ loc }}</option>
        </select>
      </label>
      <button @click="setLocaleHandler">Set</button>

      <label class="input">
        <span>disabled change token</span>
        <input type="checkbox" v-model="disabledTokenChanging" />
      </label>

      <span>theme</span>
      <div>
        <span>dark</span>
        <input type="radio" value="dark" v-model="themeType" />
        <span>light</span>
        <input type="radio" value="light" v-model="themeType" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, toRaw } from 'vue';
import {
  EmbeddedBootstrapConfig,
  EmbeddedBootstrapConfigBase,
  ISwapFormEmbeddedController,
  Locale
} from '@one-inch-community/models';
import { bootstrapEmbedded } from '@one-inch-community/integration-layer/embedded';

export default defineComponent({
  setup() {
    const swapController = ref<ISwapFormEmbeddedController | null>(null);
    const configView = ref<string>('');
    const themeType = ref<EmbeddedBootstrapConfigBase['themeType']>('dark');
    const locale = ref<EmbeddedBootstrapConfigBase['locale']>(Locale.en);
    const primaryColor = ref<EmbeddedBootstrapConfigBase['primaryColor']>('#73b500');
    const chainId = ref<EmbeddedBootstrapConfigBase['chainId']>(137);
    const sourceTokenSymbol = ref<string>('usdc');
    const destinationTokenSymbol = ref<string>('usdt');
    const amount = ref<string>('');
    const disabledTokenChanging = ref<boolean>(true);

    const locales = [Locale.en, Locale.fr, Locale.ar, Locale.de, Locale.es];

    const getSwapController = () => toRaw(swapController.value)

    const getConfig = (): EmbeddedBootstrapConfig => ({
      themeType: themeType.value,
      locale: locale.value,
      primaryColor: primaryColor.value,
      chainId: chainId.value,
      renderContainer: '#container',
      widgetName: 'swap-from',
      walletProvider: window.ethereum,
      swapFromParams: {
        sourceTokenSymbol: sourceTokenSymbol.value,
        destinationTokenSymbol: destinationTokenSymbol.value,
        disabledTokenChanging: disabledTokenChanging.value
      }
    });

    const destroy = () => {
      getSwapController()?.destroy();
      swapController.value = null;
    };

    const bootstrap = () => {
      let isCancel = false;
      const handler = async () => {
        const activeController = getSwapController()
        if (activeController && !activeController.isDestroyed) return;
        const config = getConfig();
        const controller = await bootstrapEmbedded(config);
        if (isCancel) {
          controller.destroy();
          return;
        }
        swapController.value = controller;
        updateConfigView();
      };
      handler();
      return () => {
        isCancel = true;
      };
    };

    const updateConfigView = () => {
      const config: any = getConfig();
      config.walletProvider = 'window.ethereum';
      configView.value = JSON.stringify(config, null, 2);
    };

    const setSourceTokenSymbolHandler = async () => {
      await getSwapController()?.setToken('source', sourceTokenSymbol.value);
      updateConfigView();
    };

    const setDestinationTokenSymbolHandler = async () => {
      await getSwapController()?.setToken('destination', destinationTokenSymbol.value);
      updateConfigView();
    };

    const setAmountHandler = async () => {
      await getSwapController()?.setSourceTokenAmount(amount.value);
      updateConfigView();
    };

    const setChainIdHandler = async () => {
      await getSwapController()?.setChainId(chainId.value);
      updateConfigView();
    };

    const setPrimaryColorHandler = async () => {
      await getSwapController()?.setThemePrimaryColor(primaryColor.value);
      updateConfigView();
    };

    const setLocaleHandler = async () => {
      await getSwapController()?.setLocale(locale.value);
      updateConfigView();
    };

    watch(disabledTokenChanging, () => {
      destroy();
      bootstrap();
      updateConfigView();
    });

    watch(themeType, () => {
      getSwapController()?.setThemeType(themeType.value);
      updateConfigView();
    });

    onMounted(() => {
      bootstrap();
    });

    onBeforeUnmount(() => {
      destroy();
    });

    return {
      configView,
      sourceTokenSymbol,
      destinationTokenSymbol,
      amount,
      chainId,
      primaryColor,
      locale,
      disabledTokenChanging,
      themeType,
      locales,
      destroy,
      bootstrap,
      setSourceTokenSymbolHandler,
      setDestinationTokenSymbolHandler,
      setAmountHandler,
      setChainIdHandler,
      setPrimaryColorHandler,
      setLocaleHandler
    };
  }
});
</script>

<style scoped>
.main {
  display: flex;
  gap: 16px;
}

#container {
  min-height: 100px;
  width: 450px;
  border: 1px solid red;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  height: fit-content;
}

.config-view {
  margin-top: 16px;
  width: 450px;
  height: 300px;
  resize: none;
}

.input {
  display: flex;
  flex-direction: column;
}
</style>
