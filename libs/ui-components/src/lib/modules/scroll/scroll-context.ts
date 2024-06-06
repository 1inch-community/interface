import { createContext } from '@lit/context';

export interface ScrollContext extends HTMLElement {
  readonly maxHeight?: number
  readonly maxWidth?: number
  readonly scrollTopFromConsumer?: number
  setScrollTopFromConsumer(state: number): void
}

export const scrollContext = createContext<ScrollContext>(Symbol('scrollContext'));
