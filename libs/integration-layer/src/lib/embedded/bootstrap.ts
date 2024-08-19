import { EmbeddedBootstrapConfig, EmbeddedControllerType, OneInchDevPortal } from '@one-inch-community/models';
import { bootstrapApplicationContext } from './context';
import { widgets } from './widgets';
import { ElementContainer } from './model/element-container';
import { getController } from './embedded-controllers';
import { enabledEmbeddedMode, setEnvironmentValue } from '@one-inch-community/core/environment';

export async function bootstrapEmbedded<Config extends EmbeddedBootstrapConfig = EmbeddedBootstrapConfig>(config: Config): Promise<EmbeddedControllerType[Config['widgetName']]> {
  enabledEmbeddedMode()
  applyEnvironmentApi(config.oneInchDevPortal)
  const container: HTMLElement | null = typeof config.renderContainer === 'string' ? document.querySelector(config.renderContainer) : config.renderContainer
  const widgetFactory = widgets[config.widgetName]
  if (!(container instanceof HTMLElement)) throw new Error('Container is missing');
  if (!widgetFactory) throw new Error('Widget is missing');
  const containerRect = container.getBoundingClientRect();
  if (containerRect.width < 450) throw new Error('The renderContainer width must be at least 450 pixels')
  const [ contextElement, globalContext ] = await bootstrapApplicationContext(config)
  const widgetElementName = await widgetFactory()
  const widgetElement = document.createElement(widgetElementName) as ElementContainer
  await contextElement.setConfig(config)
  contextElement.appendChild(widgetElement)
  container.appendChild(contextElement)
  await widgetElement.setConfig(config)
  return getController(config.widgetName, globalContext, contextElement)
}

function applyEnvironmentApi(config: OneInchDevPortal) {
  if (typeof config === 'object') {
    setEnvironmentValue('oneInchDevPortalHost', config.devPortalHost)
    setEnvironmentValue('oneInchDevPortalToken', config.devPortalToken)
    return
  }
  if (config.startsWith('https://')) {
    setEnvironmentValue('oneInchDevPortalHost', config)
    return;
  }
  if (config.startsWith('Bearer ')) {
    setEnvironmentValue('oneInchDevPortalToken', config)
    return;
  }
}
