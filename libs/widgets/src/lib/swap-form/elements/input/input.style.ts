import { css } from 'lit';

export const inputStyle = css`

    .input-container {
        height: 128px;
        max-width: 556px;
        border-radius: 16px;
        background-color: var(--color-background-bg-secondary);
        transition: box-shadow .2s;
        padding: 16px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
    }

    .input-container.disabled {
        background-color: var(--color-background-bg-primary);
        border: 1px solid var(--color-border-border-tertiary);
    }
    
    .flex-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    
    .input-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
    }

    .symbol-container {
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: var(--color-content-content-primary);
        border-radius: 16px;
        width: fit-content;
        padding: 8px;
        margin-left: -8px;
        transition: background-color .2s;
    }
    
    .symbol {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        text-align: left;
    }
    
    .token-name {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
    }
    
    @media (hover: hover) {
        .input-container:not(.disabled):hover {
            box-shadow: 0 0 0 1px var(--color-background-bg-positive-hover);
        }
        .symbol-container:hover {
            background-color: var(--color-background-bg-positive-hover);
        }
    }
    
    .symbol-container:active {
        transform: scale(.98);
    }

`