import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';

export const swapFormStyle = css`
    
    :host {
        display: flex;
        padding-top: 48px;
        justify-content: center;
    }

    ${mobileMediaCSS(css`
        :host {
            padding-top: 24px;
        }
    `)}
`