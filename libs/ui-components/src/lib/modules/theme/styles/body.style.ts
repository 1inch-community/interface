import { css } from 'lit';

export const bodyStyle = css`

    body {
        margin: 0;
        touch-action: pan-y;
        background-color: var(--color-background-bg-body);
        box-sizing: border-box;
        overflow: hidden;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
    }
    
    * {
        user-select: none;
        outline: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
    }

`
