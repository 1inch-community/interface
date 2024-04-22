import { css } from 'lit';

export const chainSelectorListItemStyle = css`

    .container {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 8px;
        border-radius: 12px;
        background-color: transparent;
        transition: background-color .2s;
        color: var(--color-content-content-primary);
        font-size: 14px;
    }
    
    .active .list-icon {
        transform: scale(1);
        color: var(--primary);
    }
    
    .list-icon {
        margin-left: auto;
        transition: transform .2s;
        transform: scale(0);
    }
    
    @media (hover: hover) {
        .container:hover {
            background-color: var(--color-background-bg-secondary);
        }
        .container:hover .list-icon {
            transform: scale(1);
        }
    }

    .container:active {
        background-color: var(--color-background-bg-secondary);
    }

`