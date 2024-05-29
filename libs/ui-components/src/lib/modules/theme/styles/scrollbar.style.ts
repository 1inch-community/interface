import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const scrollbarStyle = css`

    /* width */
    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
    
    ${mobileMediaCSS(css`
        ::-webkit-scrollbar {
            width: 2px;
            height: 2px;
        }
    `)}
`
