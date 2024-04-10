import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';
import { css } from 'lit';

export const inputStyle = css`

    .input-container {
        height: 128px;
        border-radius: 16px;
        background-color: var(--color-background-bg-secondary);
        transition: box-shadow .2s;
        padding: 16px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 2fr;
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
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
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
    
    .amount-input {
        height: 40px;
        color: var(--color-content-content-primary);
        box-sizing: border-box;
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        text-align: right;
        border: none;
        background-color: transparent;
        outline: none;
        user-select: none;
        width: 100%;
    }

    .amount-input[type="number"]::-webkit-inner-spin-button,
    .amount-input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .amount-input[type="number"] {
        -moz-appearance: textfield;
    }
    .amount-input:disabled {
        opacity: 1;
        color: var(--color-content-content-primary);
    }
    
    @media (hover: hover) {
        .input-container:not(.disabled):hover {
            box-shadow: 0 0 0 1px var(--color-background-bg-positive-hover);
        }
        .symbol-container:hover {
            background-color: var(--color-background-bg-positive-hover);
        }
    }

    ${mobileMediaCSS(css`
        .symbol, .amount-input {
            font-size: 20px;
        }
        .input-title, .token-name {
            font-size: 14px;
        }
        .input-container {
            height: 116px;
            //padding: 16px 8px;
        }
        .symbol-container {
            padding: 4px 8px;
        }
    `)}
    
    .symbol-container:active {
        transform: scale(.98);
        background-color: var(--color-background-bg-positive-hover);
    }
    
    .select-token-text {
        word-wrap: break-word;
        white-space: nowrap
    }

`