import {
  EmbeddedControllerType,
  IApplicationContext, IGlobalEmbeddedContextElement
} from '@one-inch-community/models';
import { SwapFormEmbeddedController } from './swap-form-embedded-controller';

const controller = {
  'swap-from': (context: IApplicationContext, root: IGlobalEmbeddedContextElement) => new SwapFormEmbeddedController(context, root)
} as const

export function getController<Type extends keyof EmbeddedControllerType>(type: Type, context: IApplicationContext, root: IGlobalEmbeddedContextElement): EmbeddedControllerType[Type] {
  return controller[type](context, root);
}
