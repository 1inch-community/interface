import { css } from 'lit';

export const bodyStyle = css`

    body {
        margin: 0;
        touch-action: manipulation;
        background-color: var(--color-background-bg-body);
        height: 100vh;
        box-sizing: border-box;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
    }
    
    * {
        user-select: none;
        outline: none;
    }

`
