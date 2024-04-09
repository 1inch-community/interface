import { css, unsafeCSS } from 'lit';

type StyleConfig = {
  animationContainerSizeChangeTime: string
  sceneBackgroundColor: string
}

const defaultConfig: StyleConfig = {
  animationContainerSizeChangeTime: '.6s',
  sceneBackgroundColor: 'var(--color-background-bg-primary)',
}

export const sceneStyle = (config?: Partial<StyleConfig>) => {

  const _config: StyleConfig = { ...defaultConfig, ...config }

  return css`

      :host {
          --animation-time: ${unsafeCSS(_config.animationContainerSizeChangeTime)};
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
          padding: 1px;
          display: block;
          height: 100%;
          will-change: transform
      }
  `
}
