import { css } from 'lit';

export const appStyle = css`
    
    :host {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .content {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: auto;
    }

`
