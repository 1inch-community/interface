import { ChainId } from '@one-inch-community/models';
import { getChainById, isChainId, TokenController } from '@one-inch-community/sdk';
import { ActionFn, ActionResult, Commands, Context } from '@vaadin/router';

export const actions: ((fns: ActionFn[]) =>  ActionFn) = (fns: ActionFn[]) => {
  return async function(this: unknown, context: Context, commands: Commands)  {
    debugger
    for (const fn of fns) {
      const result: ActionResult = await fn.apply(this, [context, commands])
      if (result !== null) return result
    }
  }
}

const defaultPath = '/1/swap/ETH'

export function chainIdValidator(context: Context, commands: Commands): ActionResult {
  const chainId = context.params.chainId
  if (!isChainId(chainId)) {
    return commands.redirect(defaultPath)
  }

  return null
}

export async function sourceTokenValidation(context: Context, commands: Commands): Promise<ActionResult> {
  const chainId = +context.params.chainId as ChainId
  const sourceTokenSymbol = context.params.sourceToken as string
  if (!chainId) {
    return commands.redirect(defaultPath)
  }
  if (!sourceTokenSymbol) {
    return redirectToNativeToken(commands, chainId)
  }
  const token = await TokenController.getTokenBySymbol(chainId, sourceTokenSymbol)
  if (token.length === 0) {
    return redirectToNativeToken(commands, chainId)
  }
  return null;
}

export async function destinationTokenValidation(context: Context, commands: Commands): Promise<ActionResult> {
  const chainId = +context.params.chainId as ChainId
  const destinationToken = context.params.destinationToken as string
  const sourceTokenSymbol = context.params.sourceToken as string
  if (!chainId) {
    return commands.redirect(defaultPath)
  }
  if (!destinationToken) {
    return null;
  }
  const token = await TokenController.getTokenBySymbol(chainId, destinationToken)
  if (token.length === 0) {
    return commands.redirect([
      chainId,
      'swap',
      sourceTokenSymbol
    ].join('/'))
  }
  return null;
}

export function updateViewIfChangePathParams(context: Context, commands: Commands) {
  const ctx = (context as any).resolver.getOutlet()
  const componentName = context.route.component!
  debugger
  const component = ctx.querySelector(componentName) ?? commands.component(componentName)
  if (component) {
    const params = context.params
    for (const key in params) {
      component[key] = params[key]
    }
  }
  return component
}

export function lazy(fn: () => Promise<unknown>) {
  return async function(): Promise<ActionResult> {
    await fn()
    return null
  }
}

function redirectToNativeToken(commands: Commands, chainId: ChainId) {
  const chain = getChainById(chainId)
  return commands.redirect([
    chainId,
    'swap',
    chain.nativeCurrency.symbol
  ].join('/'))
}