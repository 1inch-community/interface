import { createContext } from '@lit/context';

export interface ScrollContext extends HTMLElement {
  maxHeight?: number
  maxWidth?: number
}

export const scrollContext = createContext<ScrollContext>(Symbol('scrollContext'));
