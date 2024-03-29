import { css, unsafeCSS } from 'lit';
import { shiftAnimation, slideAnimation } from './transition-animations';

type StyleConfig = {
  animationTime: string
  sceneBackgroundColor: string
  animation: 'slide' | 'shift'
}

const defaultConfig: StyleConfig = {
  animationTime: '.6s',
  sceneBackgroundColor: 'var(--color-background-bg-primary)',
  animation: 'slide'
}

const animation = {
  slide: slideAnimation,
  shift: shiftAnimation
}

export const sceneStyle = (config?: Partial<StyleConfig>) => {

  const _config: StyleConfig = { ...defaultConfig, ...config }

  return css`

      :host {
          --animation-time: ${unsafeCSS(_config.animationTime)};
          --animation-time-container: .2s;
      }

      .scene-container {
          min-height: 50px;
          min-width: 50px;
          position: relative;
          overflow: hidden;
          transition: height var(--animation-time-container), width var(--animation-time-container);
          border-radius: 16px;
      }

      .scene-container-animation {
          will-change: height, width;
      }

      .scene-wrapper {
          background-color: ${unsafeCSS(_config.sceneBackgroundColor)};
      }
      
      ${unsafeCSS(animation[_config.animation])}

  `
}
