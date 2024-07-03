import { mobileMediaCSS } from "@one-inch-community/core/lit";
import { getRainbowGradient } from "@one-inch-community/ui-components/theme";
import { css } from "lit";

export const swapButtonStyle = css`
      :host {
          height: 57px;
      }

      ${mobileMediaCSS(css`
          :host {
              height: 44px;
          }
      `)}
      .smart-hover {
          position: relative;
          overflow: hidden;
      }
      .on-hover,
      .off-hover {
          position: absolute;
          transition: transform .2s;
      }
      
      .on-hover {
          transform: translateY(-200%);
      }

      .rainbow {
          --button-text-color-ext: #ffffff;
          --button-text-color-ext-hover: #ffffff;
          position: relative;
      }

      .rainbow:after, .rainbow:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: ${getRainbowGradient()};
          background-size: 1000%;
          animation: bg-rainbow 300s cubic-bezier(0.4, 0, 1, 1) infinite;
          z-index: -1;
      }

      @keyframes bg-rainbow {
          0% {
              border-radius: 24px;
              background-position: 0 0;
          }
          50% {
              border-radius: 24px;
              background-size: 800%;
              background-position: 400% 0;
          }
          100% {
              border-radius: 24px;
              background-position: 0 0;
          }
      }
      @media (hover: hover) {
          .smart-hover:hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover:hover .off-hover {
              transform: translateY(200%);
          }
      }
      @media (hover: none) {
          .smart-hover .on-hover {
              transform: translateY(0);
          }

          .smart-hover .off-hover {
              transform: translateY(200%);
          }
      }

  `
