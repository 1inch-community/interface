import { css } from 'lit';

export const bodyStyle = css`
    
    html {
        background-color: var(--color-background-bg-body);
        position: fixed;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    body {
        margin: 0;
        background-color: var(--color-background-bg-body);
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
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
    }

`
