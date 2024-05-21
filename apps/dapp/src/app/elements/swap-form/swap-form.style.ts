import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const swapFormStyle = css`
    
    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }
    
    .shadow-swap-form-card {
        will-change: box-shadow;
        transform: translate3d(0, 0, 0); /*for enabled hardware rendering in Safari*/
        box-shadow: 0 12px 24px var(--primary-50);
    }

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`
