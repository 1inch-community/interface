import { mobileMediaCSS } from '@one-inch-community/core/lit';
import { css } from 'lit';

export const tokenListStubItemStyle = css`
    
    :host {
        height: 72px;
        width: 100%;
    }
    
    .item-container {
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        align-items: center;
        cursor: pointer;
        border-radius: 16px;
        transition: background-color .2s;
    }

    .name-and-balance {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    }

    .stub-loader {
        will-change: filter;
        animation: stub-loader-animation 3s ease-in-out infinite;
    }

    .stub-token-icon {
        min-width: 40px;
        min-height: 40px;
        border-radius: 50%;
        background-color: var(--color-background-bg-secondary);
    }

    .name-stub {
        background-color: var(--color-background-bg-secondary);
        height: 24px;
        width: 40%;
        border-radius: 8px;
    }

    .balance-stub {
        background-color: var(--color-background-bg-secondary);
        height: 20px;
        width: 30%;
        border-radius: 8px;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            filter: opacity(1);
        }
        50% {
            filter: opacity(0.5);
        }
    }

    ${mobileMediaCSS(css`
        .item-container {
            padding: 8px 8px;
        }
    `)}

`
