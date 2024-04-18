import { css } from 'lit';

export const walletViewAddressBalanceStyle = css`

    :host {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
    }

    .loader {
        will-change: filter;
        height: 20px;
        width: 60px;
        background-color: var(--color-background-bg-secondary);
        border-radius: 4px;
        animation: stub-loader-animation 3s ease-in-out infinite;
    }

    @keyframes stub-loader-animation {
        0%, 100% {
            filter: opacity(1);
        }
        50% {
            filter: opacity(0.5);
        }
    }

`