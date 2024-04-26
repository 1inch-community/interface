import { css } from 'lit';

export const chainSelectorListStyle = css`
    
    :host {
        width: 100%;
        height: 100%;
    }

    .card {
        height: 100%;
    }

    .scroll-container {
        position: relative;
        height: 100%;
        overflow-y: auto;
    }

    .scroll-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

`