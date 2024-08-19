import { IApplicationContext, IGlobalEmbeddedContextElement } from '@one-inch-community/models';

export const safeContextMap = new WeakMap<any, {context: IApplicationContext, root: IGlobalEmbeddedContextElement}>()
