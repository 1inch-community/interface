import { css } from 'lit';

export const fusionSwapInfoStyle = css`

    .container {
        height: 56px;
        padding: 16px;
        box-sizing: border-box;
        transition: height .2s, background-color .2s;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-radius: 16px;
    }

    .open {
        height: 176px;
    }

    .icon {
        transition: transform .2s;
        will-change: transform;
    }

    .open-icon {
        transform: rotate(180deg);
    }

    .fusion-info {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .fusion-icon {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--primary);
        text-align: right;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        transition: opacity .2s, transform .2s;
        will-change: opacity;
    }

    .fusion-icon-open {
        opacity: 0;
        transform: translate3d(20px, 0, 0);
    }
    
    @media (hover: hover) {
        .container:not(.open):hover {
            background-color: var(--color-background-bg-secondary);
        }
    }
`