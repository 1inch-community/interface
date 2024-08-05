import { css } from 'lit';

export const notificationFusionSwapViewStyles = css`

    .loading-view {
        display: flex;
        gap: 8px;
        align-items: center;
        min-height: 38px;
    }

    .loader {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid;
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
    
    .status-view-container {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }
    
    .token-icon-container {
        grid-row: 1 / span 2;
        position: relative;
        height: 34px;
        width: 34px;
        min-width: 34px;
    }
    
    .source-token-icon {
        display: block;
    }
    
    .destination-token-icon {
        position: absolute;
        display: block;
        top: 10px;
        right: 0;
    }
    
    .amount-status-view {
        font-size: 14px;
        color: var(--color-content-content-primary);
    }
    
    .symbol-view {
        font-size: 12px;
        color: var(--color-content-content-secondary);
    }
    
    .status-container {
        margin-top: 4px;
        display: flex;
        align-items: center;
        font-size: 11px;
        gap: 4px;
    }
    
    .status-view {
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        padding: 2px 6px;
    }
    
    .status-view__pending {
        background-color: var(--primary-50);
    }  
    
    .status-view__partially-filled {
        background-color: var(--primary-50);
    }

    .status-view__filled,
    .status-view__cancelled {
        background-color: var(--color-background-bg-info);
    }

    .status-view__expired {
        background-color: var(--color-background-bg-warning);
    }

    .status-view__not-enough-balance-or-allowance,
    .status-view__wrong-permit,
    .status-view__invalid-signature,
    .status-view__false-predicate {
        background-color: var(--color-background-bg-critical);
    }
    
    .cancel-button {
        margin-left: auto;
    }

    .cancel-button:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }
    
    .swap-info-container {
        width: 100%;
    }
`
