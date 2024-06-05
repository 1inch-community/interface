import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const fiatBalanceStyles = css`

    :host {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: right;
        color: var(--color-content-content-secondary);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    ${mobileMediaCSS(css`
        :host {
            font-size: 13px;
        }
    `)}

`
