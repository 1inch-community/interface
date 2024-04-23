import { createContext } from '@lit/context';
import { type Router } from '@vaadin/router';

export const routerContext = createContext<Router>(Symbol('RouterContext'));