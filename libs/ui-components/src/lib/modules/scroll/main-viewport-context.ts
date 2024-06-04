import { ContextProvider, createContext } from '@lit/context';
import { ReactiveElement } from 'lit';

export const mainViewportContext = createContext<ReactiveElement>(Symbol('mainViewportContext'));

export function createMainViewportContext(ctx: ReactiveElement) {
  const contextProvider = new ContextProvider(ctx, { context: mainViewportContext })
  contextProvider.setValue(ctx)
}
