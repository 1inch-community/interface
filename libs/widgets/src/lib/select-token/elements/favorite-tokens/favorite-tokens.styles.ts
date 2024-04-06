import { css } from 'lit';

export const favoriteTokensStyles = css`
    .favorite-container-scroll {
        display: flex;
        height: 36px;
        width: 100%;
        position: relative;
        overflow-y: auto;
        padding-bottom: 8px;
        margin-bottom: 8px;
        margin-top: 16px;
        transition: height .2s, padding-bottom .2s, margin-bottom .2s;
    }
    
    .empty {
        height: 0;
        padding-bottom: 0;
        margin-bottom: 0;
    }
    
    .favorite-container {
        display: flex;
        gap: 12px;
        max-height: 84px;
        position: absolute;
    }

    ::-webkit-scrollbar {
        height: 2px;
    }

    .favorite-container-scroll::-webkit-scrollbar-thumb {
        transition: background-color .2s;
        background: var(--color-background-bg-primary);
    }
    
    @media (hover: hover) {
        .favorite-container-scroll:hover::-webkit-scrollbar-thumb {
            background: var(--primary);
        }
    }

    .favorite-container-scroll:active::-webkit-scrollbar-thumb {
        background: var(--primary);
    }

`