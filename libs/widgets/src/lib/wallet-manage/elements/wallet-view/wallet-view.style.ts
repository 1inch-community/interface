import { css } from 'lit';

export const walletViewStyle = css`
    
    :host {
        display: block;
        transition: height .2s;
        overflow: hidden;
    }

    .wallet-view-container {
        display: flex;
        align-content: center;
        justify-content: space-between;
        padding: 20px 16px;
        border-radius: 16px;
        transition: background-color .2s, height .2s;
        position: relative;
        overflow: hidden;
        color: var(--color-content-content-primary);
    }

    .wallet-icon {
        width: 24px;
        height: 24px;
    }

    .wallet-name {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
    
    .connect-icon {
        color: var(--color-content-content-primary);
        margin-left: auto;
        transform: scale(0);
        transition: transform .2s;
    }
    
    .connect-icon__connected {
        transform: scale(1);
        transition: color .2s;
        color: var(--color-content-content-primary);
    }
    
    .connect-icon__active {
        transform: scale(1);
        transition: color .2s;
        color: var(--primary);
    }
    
    .data-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .loader-icon {
        height: 24px;
        width: 24px;
        margin-left: auto;
    }
    
    .address-list {
        display: flex;
        flex-direction: column;
    }

    inch-wallet-view-address-balance {
        transform: translate3d(24px, 0, 0);
        transition: transform .2s;
        will-change: transform;
    }
    
    .add-connection {
        transition: transform .2s;
        transform: scale(0);
    }

    .address-container__active inch-wallet-view-address-balance {
        transform: translate3d(0, 0, 0);
    }
    
    .wallet-view-container__wc.wallet-view-container__connected:not(.wallet-view-container__loading) .right-data {
        transform: translate3d(36px, 0, 0);
        transition: transform .2s;
    }
    
    @media (hover: hover) {
        .wallet-view-container:hover {
            background-color: var(--color-background-bg-secondary);
        }
        .wallet-view-container:hover .connect-icon {
            transform: scale(1);
        }
        .wallet-view-container:hover inch-wallet-view-address-balance {
            transform: translate3d(0, 0, 0);
        }
        .wallet-view-container:hover .add-connection {
            transform: scale(1);
        }
        .wallet-view-container:hover.wallet-view-container__wc.wallet-view-container__connected .right-data {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @media (hover: none) {
        .wallet-view-container__wc.wallet-view-container__connected:not(.wallet-view-container__loading) .right-data {
            transform: translate3d(0, 0, 0);
        }

        .add-connection {
            transform: scale(1);
        }
    }

    @keyframes rainbow {
        0% {
            background-position: 0;
        }
        100% {
            background-position: 100%;
        }
    }

`
