import { css } from 'lit';

export const cardStyle = css`
    
    
    :host {
        background-color: var(--color-background-bg-primary);
        border-radius: 32px;
        width: fit-content;
        height: fit-content;
        display: block;
    }
    
    :host(.mobile) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    
    .card-content {
        padding: 16px;
        display: flex;
        width: 100%;
        box-sizing: border-box;
        flex-direction: column;
        gap: 8px;
    }

`