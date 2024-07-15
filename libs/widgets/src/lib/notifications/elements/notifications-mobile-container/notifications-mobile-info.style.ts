import { css } from 'lit';

export const notificationsMobileInfoStyle = css`
    
    
    :host {
        width: 100%;
    }

    .grid-container {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr;
        grid-gap: 16px;
    }
    
    .address {
        padding-top: 8px;
        font-size: 16px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
        height: fit-content;
        text-align: center;
        color: var(--color-content-content-primary);
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        align-items: center;
    }


`
