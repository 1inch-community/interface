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
    
    .notification-template {
        font-size: 14px;
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
