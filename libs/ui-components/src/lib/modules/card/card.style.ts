import { css } from 'lit';

export const cardStyle = css`
    
    :host {
        background-color: var(--color-background-bg-primary);
        border-radius: 24px;
        width: fit-content;
        height: fit-content;
        display: block;
    }
    
    :host(.mobile) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        width: 100vw;
        height: fit-content;
    }

    :host(.shadow) {
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    }
    
    .card-content {
        padding: 8px;
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        flex-direction: column;
        gap: 8px;
    }

`
