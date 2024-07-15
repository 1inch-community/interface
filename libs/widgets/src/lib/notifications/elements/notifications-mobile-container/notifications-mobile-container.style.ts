import { css } from 'lit';

export const notificationsMobileContainerStyle = css`

    :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3000;
        display: grid;
        flex-direction: column;
        overflow-x: hidden;
    }

    .scroll-content-container {
        position: relative;
        padding: 8px;
        box-sizing: border-box;
        max-width: 100vw;
    }

    .info-view {
        display: flex;
        width: 100%;
        height: 48px;
    }

    .notification-close-container {
        position: sticky;
        top: 0;
    }
`
