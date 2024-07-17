import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/core/lit';

export const connectWalletViewStyle = css`

    .connect-wallet-view-container {
        padding: 8px 5px 8px 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        background: var(--color-background-bg-primary);
        height: 40px;
        box-sizing: border-box;
    }

    .connect-wallet-view-icon {
        width: 24px;
        height: 24px;
    }
    
    ${mobileMediaCSS(css`
        .connect-wallet-view-container {
            padding: 6px;
            width: 36px;
            height: 36px;
        }
    `)}

`
