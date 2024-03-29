import { css } from 'lit';

export const slideAnimation = css`

    /* --- up scene animation --- */

    .scene-up {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9;
        will-change: transform
    }

    .scene-up-in-start {
        transform: translateX(100%);
    }

    .scene-up-out-start {
        transform: translateX(0);
    }

    .scene-up-in {
        animation: up-in var(--animation-time) cubic-bezier(.2, .8, .2, 1);
    }

    .scene-up-out {
        animation: up-out var(--animation-time) cubic-bezier(.2, .8, .2, 1);
    }

    @keyframes up-in {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes up-out {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(100%);
        }
    }

    /* --- down scene animation --- */

    .scene-down {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 8;
        will-change: transform, filter
    }

    .scene-down-in-start {
        transform: translateX(0);
        filter: blur(0);
    }

    .scene-down-out-start {
        transform: translateX(-50%);
        filter: blur(3px);
    }

    .scene-down-in {
        animation: down-in var(--animation-time) cubic-bezier(.2, .8, .2, 1);
    }

    .scene-down-out {
        animation: down-out var(--animation-time) cubic-bezier(.2, .8, .2, 1);
    }

    @keyframes down-in {
        from {
            transform: translateX(0);
            filter: blur(0);
        }
        to {
            transform: translateX(-50%);
            filter: blur(3px);
        }
    }

    @keyframes down-out {
        from {
            transform: translateX(-50%);
            filter: blur(3px);
        }
        to {
            transform: translateX(0);
            filter: blur(0);
        }
    }

`