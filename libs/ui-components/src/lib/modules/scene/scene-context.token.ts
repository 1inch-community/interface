import { createContext } from '@lit/context';
import { SceneContext } from './scene-context';

export const sceneContext = createContext<SceneContext>(Symbol('scene context'))