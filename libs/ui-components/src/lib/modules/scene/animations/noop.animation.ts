import { Animation } from './animation';
import { asyncTimeout } from '@one-inch-community/core/async';

export function noopAnimation(): Animation {
  return {
    preparation: async () => void 0,
    transition: async () => {
      await asyncTimeout(100)
    }
  }
}
