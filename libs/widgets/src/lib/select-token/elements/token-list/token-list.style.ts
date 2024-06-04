import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const tokenListStyle = css`

    :host {
        height: 50vh;
        width: 100%;
    }
    
    ${mobileMediaCSS(css`
        :host {
            height: 100%;
            width: 100%;
        }
    `)}
`
