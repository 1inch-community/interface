import { css } from 'lit';

export const tokenListStyle = css`

    :host {
        height: 100%;
        width: 100%;
        position: relative;
    }
    
    .list-container {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
    }

    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .loader-view-container {
        padding-right: 7px;
    }


`