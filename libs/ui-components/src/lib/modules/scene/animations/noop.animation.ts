import { Animation } from './animation';
import { asyncTimeout } from '../../async/async-timeout';

export function noopAnimation(): Animation {
  return {
    preparation: async () => void 0,
    transition: async () => {
      await asyncTimeout(100)
    }
  }
}
