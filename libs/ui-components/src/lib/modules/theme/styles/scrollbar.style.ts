import { css } from 'lit';
import { mobileMediaCSS } from '../../lit/match-media';

export const scrollbarStyle = css`

    /* width */
    ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
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
        width: 10px;
    }
    
    ${mobileMediaCSS(css`
        ::-webkit-scrollbar {
            width: 3px;
            height: 7px;
        }
    `)}
  
`