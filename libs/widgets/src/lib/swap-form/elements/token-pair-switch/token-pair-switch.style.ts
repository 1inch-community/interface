import { css } from 'lit';

export const tokenPairSwitchStyle = css`

    :host {
        height: 4px;
        position: relative;
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    .switcher {
        position: absolute;
        border-radius: 50%;
        border: none;
        background-color: var(--color-background-bg-primary);
        color: var(--color-content-content-primary);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 50%;
        top: -13px;
        cursor: pointer;
        transition: color .2s;
    }
    
    .switcher:disabled {
        cursor: not-allowed;
        pointer-events: none;
        color: var(--color-content-content-disabled);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
    }
    
    @media (hover: hover) {
        .switcher:not(:disabled):hover {
            color: var(--color-content-content-secondary);
        }
    }

    .switcher-icon {
        transition: transform .2s;
    }
    
    .switcher-icon-up {
        transform: rotate(180deg);
    }
    
    .switcher-icon-down {
        transform: rotate(360deg);
    }

    .switcher-icon-off-transition {
        transition: none;
    }
`