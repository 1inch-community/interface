import { css } from 'lit';
import { mobileMediaCSS } from '@one-inch-community/core/lit';

export const cardHeaderStyle = css`

    :host {
        display: flex;
        height: 60px;
        width: 100%;
        padding: 16px 16px 0;
        box-sizing: border-box;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
    }
    
    :host(.not-native-mode) {
        height: 44px;
        padding: 0;
    }

    .card-header-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        height: 100%;
    }

    .position-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        color: var(--color-content-content-primary);
        gap: 8px;
        word-wrap: break-word;
        white-space: nowrap;
    }

    .center-container {
        justify-content: center;
    }

    .left-container {
        justify-content: flex-start;
    }

    .right-container {
        justify-content: flex-end;
    }

    .card-header-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        letter-spacing: 0;
        text-align: center;
    }
    
    .card-header-title__left:not(.card-header-title__and-back) {
        margin-left: 8px;
    }

    .card-header-title__left:not(.card-header-title__and-back):dir(rtl) {
        margin-right: 8px;
    }

    ${mobileMediaCSS(css`
        .card-header-title {
            font-size: 16px;
        }
        :host {
            padding: 8px 8px 0;
        }
    `)}

`
