import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';
import { getRainbowGradient } from '@one-inch-community/ui-components/theme';

export const swapFormStyle = css`

    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }

    .shadow-container {
        will-change: box-shadow;
        transform: translate3d(0, 0, 0); /*for enabled hardware rendering in Safari*/
        box-shadow: 0 5px 24px var(--primary-50);
        border-radius: 24px;
    }

    .shadow-container-rainbow {
        box-shadow: none;
        position: relative;
    }

    .shadow-container-rainbow:after, .shadow-container-rainbow:before {
        content: '';
        position: absolute;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        left: -1px;
        top: -1px;
        border-radius: 24px;
        background: ${getRainbowGradient()};
        background-size: 2000%;
        animation: bg-rainbow 90s cubic-bezier(0.4, 0, 1, 1) infinite;
        z-index: -1;
        will-change: background, width, height, left, top, background-position;
    }

    .shadow-container-rainbow:after {
        filter: blur(30px);
    }

    @keyframes bg-rainbow {
        0% {
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            left: -1px;
            top: -1px;
            background-position: 0 0;
        }
        50% {
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-size: 800%;
            background-position: 400% 0;
        }
        100% {
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            left: -1px;
            top: -1px;
            background-position: 0 0;
        }
    }

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`
