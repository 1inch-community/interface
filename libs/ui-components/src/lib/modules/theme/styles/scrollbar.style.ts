import { css, unsafeCSS } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/lit';

export const getScrollbarStyle = (hostName: string, hideScrollBar?: boolean) => css`
    
    ${unsafeCSS(hostName)} {
        overflow: auto;
        touch-action: pan-y;
        overscroll-behavior: none;
        scrollbar-color: var(--primary) transparent;
        scrollbar-width: ${unsafeCSS(hideScrollBar ? 'none' : 'thin')};
        scrollbar-gutter: stable;
    }

    /* width */
    ${unsafeCSS(hostName)}::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* Track */
    ${unsafeCSS(hostName)}::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    ${unsafeCSS(hostName)}::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    /* Handle on hover */
    ${unsafeCSS(hostName)}::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
    
    ${mobileMediaCSS(css`
        ${unsafeCSS(hostName)}::-webkit-scrollbar {
            display: none;
        }
    `)}
    
    ${unsafeCSS(
      hideScrollBar ? css`
          ${unsafeCSS(hostName)}::-webkit-scrollbar {
              display: none;
          }
    `: ''
    )}
`
export const scrollbarStyle = getScrollbarStyle(':host')
