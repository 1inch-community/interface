import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';

export const appStyle = css`
    
    :host {
        display: block;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .content {
        height: calc(100svh - 65px - 72px);
    }
    
    ${mobileMediaCSS(css`
        .content {
            height: calc(100svh - 56px - 72px);
        }
    `)}

`