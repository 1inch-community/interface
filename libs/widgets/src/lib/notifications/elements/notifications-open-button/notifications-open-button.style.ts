import { css } from 'lit';

export const notificationsOpenButtonStyle = css`

    :host {
        position: relative;
    }
    
    .notification-counter {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 8px;
        background-color: var(--color-core-red-critical);
        border-radius: 8px;
        min-width: 10px;
        height: 12px;
        display: flex;
        padding-left: 2px;
        padding-right: 2px;
        justify-content: center;
        align-items: center;
        color: var(--color-content-content-primary);
        pointer-events: none;
    }
`
