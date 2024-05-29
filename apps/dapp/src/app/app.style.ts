import { css } from 'lit';
import { IosCss } from '@one-inch-community/lit';

export const appStyle = css`
    
    :host {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    ${IosCss(css`
        :host {
            padding-right: 30px;
        }

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
