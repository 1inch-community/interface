import { mobileMediaCSS } from '@one-inch-community/lit';
import { css } from 'lit';

export const balanceStyles = css`

    :host {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: right;
        width: fit-content;
        color: var(--color-content-content-secondary);
    }

    ${mobileMediaCSS(css`
        :host {
            font-size: 13px;
        }
    `)}
`
