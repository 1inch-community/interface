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
    
    .loader {
        position: absolute;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        width: 0;
        z-index: 9;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 16px;
    }
    
    .loader:before {
        content: " ";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 16px;
        background: linear-gradient(90deg,
        rgba(131,58,180,1),
        rgba(255,0,0,1),
        rgba(252,176,69,1)
        );
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

    .address-container__active inch-wallet-view-address-balance {
        transform: translate3d(0, 0, 0);
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