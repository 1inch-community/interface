import { css } from 'lit';

export const notificationsBaseContainerStyle = css`

    .close-button-container {
        pointer-events: all;
        margin-left: auto;
    }

    .notification-close-container {
        position: relative;
    }

    .close-notification-button {
        pointer-events: all;
        position: absolute;
        top: -8px;
        right: -8px;
        transform: scale(0);
        transition: transform .2s;
    }

    .notification-container {
        pointer-events: all;
        color: var(--color-content-content-primary);
        background-color: var(--color-background-bg-primary);
        border-radius: 8px;
        padding: 8px;
        box-sizing: border-box;
        width: 100%;
        min-height: 50px;
        border: 1px solid var(--primary-12);
        transition: border .2s;
    }
    
    .notification-title {
        font-size: 16px;
        padding-bottom: 4px;
        display: flex;
    }
    
    .notification-template {
        font-size: 14px;
    }
    
    .notification-time {
        font-size: 11px;
        color: var(--color-content-content-secondary);
        margin-left: auto;
    }
    
    .show-all-button {
        pointer-events: all;
    }

    @media (hover: hover) {
        .notification-container:hover {
            border: 1px solid var(--primary-50);
        }

        .notification-close-container:hover .close-notification-button {
            transform: scale(1);
        }
    }

`
