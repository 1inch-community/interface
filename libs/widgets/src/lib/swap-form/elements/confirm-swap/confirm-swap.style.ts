import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const confirmSwapStyle = css`

    :host {
        --font-size: 16px;
    }
    
    .confirm-swap-view {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .token-view-container {
        background-color: var(--color-background-bg-secondary);
        border-radius: 16px;
        padding: 16px;
    }

    .token-view {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .token-view-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .token-view-top {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .primary-text {
        color: var(--color-content-content-primary);
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 32px;
    }
    
    .symbol-view {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .separator {
        position: relative;
        color: var(--color-content-content-primary);
    }
    
    .separator-arrow-container {
        border-radius: 50%;
        background-color: var(--color-background-bg-primary);
        width: 32px;
        height: 32px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }
    
    .separator-arrow-container-loader:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid transparent;
        border-radius: 50%;
        border-bottom-color: var(--primary);
        border-top-color: var(--primary);
        animation: spin 2s linear infinite;
    }
    
    .detail-info {
        padding: 8px 0;
    }
    
    .detail-info-row {
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
    }
    
    .detail-info-row-title {
        color: var(--color-content-content-secondary);
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .detail-info-raw-value {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: var(--font-size);
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        transition: color .2s;
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .detail-info-raw-settings-value {
        color: var(--primary);
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    
    .separator-view {
        position: absolute;
        background-color: var(--color-background-bg-primary);
        height: 2px;
        width: 100%;
        border-radius: 2px;
        top: 50%;
        z-index: 1;
    }

    ${mobileMediaCSS(css`
        :host {
            --font-size: 13px
        }

        .primary-text {
            font-size: 20px;
        }

        .detail-info-row {
            padding: 4px 8px;
        }

        .token-view {
            gap: 4px;
        }

        .separator-arrow-container {
            width: 28px;
            height: 28px;
        }

        .token-view-container {
            padding: 8px 16px;
        }
    `)}
`
