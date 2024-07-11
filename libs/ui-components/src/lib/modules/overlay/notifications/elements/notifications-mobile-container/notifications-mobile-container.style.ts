import { css } from 'lit';

export const notificationsMobileContainerStyle = css`

    :host {
        position: fixed;
        z-index: 3000;
        display: grid;
        flex-direction: column;
        overflow-x: hidden;
        transition: backdrop-filter .2s, background .2s;
    }

    :host(.show-all) {
        box-sizing: border-box;
        top: 0;
        right: 0;
        height: 100vh;
        overflow-y: auto;
    }

    .scroll-content-container {
        position: relative;
        padding: 8px;
    }

    .info-view {
        display: flex;
        width: 100%;
        height: 55vh;
    }

    .notification-close-container {
        position: sticky;
        top: 0;
    }

`
