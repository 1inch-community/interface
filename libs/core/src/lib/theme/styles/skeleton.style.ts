import { css, unsafeCSS } from 'lit';

type Config = {
  prefixName?: string
  animationDuration?: string
  animationDelay?: string
}

const defaultConfig: Config = {
  prefixName: '',
  animationDuration: '2s',
  animationDelay: '0s'
}

export const skeletonStyle = (config?: Config) => {

  const _config: Config = { ...defaultConfig, ...config }

  const className = [
    'skeleton',
    _config.prefixName
  ].filter(Boolean).join('-')

  return css`
      .${unsafeCSS(className)} {
          position: relative;
          overflow: hidden;
          color: transparent;
      }

      .${unsafeCSS(className)}::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          transform: translateX(-110%);
          opacity: .5;
          background-image: linear-gradient(
                  90deg,
                  var(--primary-1) 0,
                  var(--primary-5) 50%,
                  var(--primary-1) 100%
          );
          animation: shimmer ${unsafeCSS(_config.animationDuration)} infinite;
          animation-delay: ${unsafeCSS(_config.animationDelay)};
          content: '';
      }

      @keyframes shimmer {
          100% {
              transform: translateX(110%);
          }
      }

  `
}
