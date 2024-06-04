import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const tokenListItemStyle = css`
    
    :host {
        height: 72px;
        width: 100%;
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
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
        max-width: 50%;
    }

    .name-and-balance .name {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .name-and-balance .balance {
        color: var(--color-content-content-secondary);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    
    .usd-balance {
        color: var(--color-content-content-primary);
        text-align: right;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        white-space: nowrap
    }
    
    .usd-balance-and-favorite-start {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-left: auto;
    }
    
    @media (hover: hover) {
        .item-container:hover {
            background-color: var(--color-background-bg-secondary);
        }

        .item-container:not(.is-favorite-token) .usd-balance {
            transform: translateX(24px);
            transition: transform .2s;
        }

        .item-container:not(.is-favorite-token) .is-favorite-start {
            transform: scale(0);
            transition: transform .2s;
        }

        .item-container:hover .is-favorite-start {
            transform: scale(1);
        }

        .item-container:hover .usd-balance {
            transform: translateX(0);
        }
    }
    
    ${mobileMediaCSS(css`
        .item-container {
            padding: 8px 8px;
        }
    `)}

    .item-container:active {
        background-color: var(--color-background-bg-secondary);
    }

`
