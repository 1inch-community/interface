import { mobileMediaCSS } from '@one-inch-community/ui-components/lit';
import { css } from 'lit';

export const balanceStyles = css`

    :host {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: right;
        color: var(--color-content-content-secondary);
    }

    ${mobileMediaCSS(css`
        :host {
            font-size: 14px;
        }
    `)}
`