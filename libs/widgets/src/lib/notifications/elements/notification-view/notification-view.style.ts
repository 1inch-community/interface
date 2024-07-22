import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/core/lit';

export const notificationViewStyle = css`

    :host {
        position: relative;
        display: block;
    }

    .notification-container {
        --border-color: var(--primary-12);
        pointer-events: all;
        color: var(--color-content-content-primary);
        background-color: var(--color-background-bg-primary);
        border-radius: 8px;
        padding: 8px;
        box-sizing: border-box;
        width: 100%;
        min-height: 50px;
        border: 1px solid var(--border-color);
        transition: border .2s;
    }
    
    .error {
        --border-color: var(--color-background-bg-critical);
    }
    
    .warning {
        --border-color: var(--color-background-bg-warning);
    }

    .close-notification-button {
        pointer-events: all;
        position: absolute;
        top: -8px;
        right: -8px;
        transform: scale(0);
        transition: transform .2s;
    }

    @media (hover: hover) {
        .notification-container:hover {
            --border-color: var(--primary-50);
        }
        
        .notification-container.error:hover {
            --border-color: var(--color-background-bg-critical-hover);
        }

        .notification-container.warning:hover {
            --border-color: var(--color-background-bg-warning-hover);
        }


        .notification-close-container:hover .close-notification-button {
            transform: scale(1);
        }
    }
    
    ${mobileMediaCSS(css`
        :host {
            width: calc(100vw - 16px);
        }
    `)}

`
