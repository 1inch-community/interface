import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';

export const swapFormStyle = css`
    
    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }
    
    .shadow-swap-form-card {
        box-shadow: 0 12px 24px var(--primary-50);
    }

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`