import { css, unsafeCSS } from 'lit';

type StyleConfig = {
  sceneBackgroundColor: string
}

const defaultConfig: StyleConfig = {
  sceneBackgroundColor: 'var(--color-background-bg-primary)',
}

export const sceneStyle = (config?: Partial<StyleConfig>) => {

  const _config: StyleConfig = { ...defaultConfig, ...config }

  return css`

      :host {
          --scene-background-color: ${unsafeCSS(_config.sceneBackgroundColor)};
      }

      .scene-container {
          min-height: 50px;
          min-width: 50px;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          will-change: width, height;
      }
  `
}
