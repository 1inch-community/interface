import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const fusionSwapInfoAuctionTimeStyle = css`

    .slippage-title {
        display: flex;
        padding: 8px;
        gap: 8px;
        color: var(--color-content-content-primary);
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
        font-size: 16px;
    }
    
    .back-icon {
        transform: rotate(90deg);
    }
    
    ${mobileMediaCSS(css`
        .slippage-title {
            font-size: 13px;
        }
    `)}

`
