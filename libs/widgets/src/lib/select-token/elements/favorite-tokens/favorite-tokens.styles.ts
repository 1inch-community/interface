import { css } from 'lit';

export const favoriteTokensStyles = css`
    :host {
        display: flex;
        width: 100%;
        height: 60px;
    }
    
    :host(.empty) {
        height: 16px;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    :host(.transition-host) {
        transition: height .2s, padding-bottom .2s, margin-bottom .2s;
    }
    
    :host(.remove-favorite-token-show) .remove-favorite-token {
        transform: scale(1) translate(0, 0);
    }
    
    .favorite-container-scroll {
        overflow-y: hidden;
        overflow-x: auto;
        touch-action: pan-x;
        position: relative;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        height: 36px;
    }

    .favorite-container-scroll::-webkit-scrollbar {
        display: none;
    }
    
    .favorite-container {
        display: flex;
        gap: 12px;
        height: 36px;
        position: absolute;
    }
    
    .favorite-token-item-container {
        position: relative;
    }
    
    .remove-favorite-token {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-background-bg-secondary);
        z-index: 9;
        transition: transform .2s;
        transform: scale(0) translate(-16px, 16px);
        cursor: pointer;
        color: var(--color-content-content-primary);
    }
    
    @media (hover: hover) {
        .favorite-token-item-container:hover .remove-favorite-token {
            transform: scale(1) translate(0, 0);
        }
        .remove-favorite-token:hover {
            background-color: var(--secondary-hover);
        }
        .edit-favorite-token-list {
            display: none;
        }
    }
    
    

`
