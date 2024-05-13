import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const appStyle = css`
    
    :host {
        display: block;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100svh;
    }

    .content {
        height: calc(100svh - 72px - 72px);
        min-height: calc(400px + 72px + 72px);
    }
    
    ${mobileMediaCSS(css`
        .content {
            height: calc(100svh - 56px - 72px);
            min-height: 0;
            padding: 0 8px;
        }
    `)}

`
