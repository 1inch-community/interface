import { css } from 'lit';

export const appStyle = css`
    
    :host {
        overflow: hidden;
        display: block;
    }

    .content {
        height: calc(100svh - 65px - 72px);
    }
    
    .content.mobile {
        //min-height: -webkit-fill-available;
        height: calc(100svh - 56px - 72px);
    }

`