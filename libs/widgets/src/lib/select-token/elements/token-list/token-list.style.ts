import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const tokenListStyle = css`

    :host {
        height: 50vh;
        width: 100%;
        //position: relative;
    }
    
    .overlay-message {
        position: absolute;
        top: 35%;
        left: 0;
        width: 100%;
        text-align: center;
        color: var(--color-content-content-primary);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    ${mobileMediaCSS(css`
        :host {
            height: 100%;
            width: 100%;
        }
    `)}
`
