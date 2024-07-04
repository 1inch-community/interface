import { mobileMediaCSS } from '@one-inch-community/core/lit';
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
        grid-template-columns: minmax(40%, auto) minmax(auto, 70%);
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
        height: fit-content;
    }
    
    .input-title {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
        width: fit-content;
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
        padding: 8px;
        margin-left: -8px;
        transition: background-color .2s;
        outline: none;
        user-select: none;
        width: fit-content;
        -webkit-tap-highlight-color: transparent;
    }
    
    .symbol {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        letter-spacing: 0;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    
    .token-name {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: var(--color-content-content-secondary);
        font-style: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .token-name:dir(rtl) {
        text-align: right;
    }
    
    .amount-input {
        height: 48px;
        padding: 0;
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
    
    .input-rtl {
        text-align: left; 
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
    
    .balance-amount-fiat {
        align-items: flex-end;
    }
    
    .focus:not(.disabled) {
        box-shadow: 0 0 0 1px var(--color-background-bg-positive-hover); 
    }
    
    .balance-and-max {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .loading {
        will-change: opacity;
        animation: stub-loader-animation 2s ease-in-out infinite;
    }
    
    .input-rtl {
        text-align: end;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
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
        .amount-input {
            height: 40px;
        }
        .symbol, .amount-input {
            font-size: 20px;
        }
        .input-title, .token-name {
            font-size: 13px;
        }
        .input-container {
            height: 116px;
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
