import { css, unsafeCSS } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';
import { rainbowRandomColorsInterpolate } from '@one-inch-community/ui-components/theme';

const rainbowColors = () => rainbowRandomColorsInterpolate

export const swapFormStyle = css`

    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }

    .shadow-container {
        will-change: box-shadow;
        transform: translate3d(0, 0, 0); /*for enabled hardware rendering in Safari*/
        box-shadow: 0 12px 24px var(--primary-50);
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
        background: linear-gradient(90deg, ${unsafeCSS(rainbowColors())});
        background-size: 1000%;
        animation: bg-rainbow 300s cubic-bezier(0.4, 0, 1, 1) infinite;
        z-index: -1;
    }

    .shadow-container-rainbow:after {
        filter: blur(30px);
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

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`
