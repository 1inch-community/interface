import { css } from 'lit';

export const notificationsDesktopContainerStyle = css`

    :host {
        --offset: 72px;
        position: fixed;
        z-index: 1000;
        margin-bottom: var(--offset);
        padding-top: var(--offset);
        padding-bottom: 8px;
        padding-right: 8px;
        box-sizing: border-box;
        top: 0;
        right: 0;
        height: 100vh;
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-x: hidden;
        pointer-events: none;
    }
    
    .close-button-container {
        display: flex;
    }

`
