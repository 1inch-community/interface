import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/core/lit';

export const settingsStyle = css`
    
    :host {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .settings-view-item {
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        height: 64px;
        width: 100%;
        border-radius: 16px;
        display: flex;
        padding: 20px 16px;
        box-sizing: border-box;
        gap: 8px;
        transition: background-color .2s;
    }
    
    .main-settings-container {
        display: flex;
        flex-direction: column;
        position: relative;
        
        gap: 8px;
        height: fit-content;
        width: 100%;
        min-width: 300px;
    }
    
    .segmented-control-container {
        padding-top: 16px;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .segmented-control-label {
        padding-left: 16px;
    }
    
    .theme-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        color: var(--color-content-content-primary);
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        gap: 16px;
    }
    
    .theme-item {
        border-radius: 16px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background-color: var(--color-background-bg-secondary);
        box-sizing: border-box;
        transition: box-shadow .2s;
    }
    
    .theme-item-select {
        box-shadow: inset 0 0 0 1px var(--primary);
    }
    
    @media (hover: hover) {
        .settings-view-item:hover {
            background-color: var(--color-background-bg-secondary);
        }
        
        .theme-item:not(.theme-item-select):hover {
            box-shadow: inset 0 0 0 1px var(--primary-50)
        }
    }

    ${mobileMediaCSS(css`
        .main-settings-container {
            width: calc(100vw - 16px);
        }
    `)}
`
