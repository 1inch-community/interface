import { css } from 'lit';

export const searchTokenInputStyle = css`

    .search-token-input-container {
        display: flex;
        background-color: var(--color-background-bg-secondary);
        height: 48px;
        border-radius: 12px;
        color: var(--color-content-content-tertiary);
        align-items: center;
        padding-left: 12px;
        padding-right: 12px;
        box-sizing: border-box;
        gap: 8px;
        margin-top: 5px;
        transition: box-shadow .2s;
    }
    
    .search-token-input {
        border: none;
        background-color: transparent;
        height: 100%;
        width: 100%;
        outline: none;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .loader {
        width: 24px;
        min-width: 24px;
        height: 24px;
        min-height: 24px;
        border-radius: 50%;
        border: 2px solid;
        border-bottom-color: var(--secondary);
        border-top-color: var(--secondary);
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    
    .search-token-input::placeholder {
        color: var(--color-content-content-secondary);
    }
    
    @media (hover: hover) {
        .search-token-input-container:hover {
            box-shadow: 0 0 0 1px var(--primary);
        }
    }
    
    .search-token-input-container__focused {
        box-shadow: 0 0 0 1px var(--primary);
    }

`
