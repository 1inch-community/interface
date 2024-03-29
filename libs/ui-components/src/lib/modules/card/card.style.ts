import { css } from 'lit';

export const cardStyle = css`
    
    
    :host {
        background-color: var(--color-background-bg-primary);
        border-radius: 32px;
        width: fit-content;
        height: fit-content;
    }
    
    .card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

`