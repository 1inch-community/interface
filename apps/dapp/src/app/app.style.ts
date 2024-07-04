import { css } from 'lit';
import { mobileMediaCSS, safariPWACss } from '@one-inch-community/core/lit';

export const appStyle = css`
    
    :host {
        --height: 100vh;
        overflow-y: auto;
        overflow-x: hidden !important;
        height: var(--height);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: var(--color-background-bg-body);
        overscroll-behavior: none;
        touch-action: pan-y;
        transition: height .2s;
    }

    @supports (height: 100dvh) {
        :host {
            --height: 100dvh;
        }
    }
    
    ${mobileMediaCSS(css`
        :host::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${safariPWACss(css`
        :host {
            height: calc(var(--height) - 10px);
        }
    `)}

    .content {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: auto;
    }

`
