import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const appStyle = css`
    
    :host {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: var(--color-background-bg-body);
    }
    
    ${mobileMediaCSS(css`
        :host::-webkit-scrollbar {
            display: none;
        }
    `)}

    .content {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: auto;
    }

`
