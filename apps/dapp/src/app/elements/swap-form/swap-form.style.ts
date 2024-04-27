import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';

export const swapFormStyle = css`
    
    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }
    
    .shadow-swap-form-card {
        box-shadow: var(--orientation-x, 0) var(--orientation-y, 12px) 50px var(--primary-50);
        transition: box-shadow .03s;
    }

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`