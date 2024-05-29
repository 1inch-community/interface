import { css } from 'lit';

export const swapFromStyle = css`

    .swap-form-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: fit-content;
        width: 100%;
        min-width: 300px;
    }

    .input-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .input-header {
        height: 68px;
        padding: 16px 0 16px 8px;
        box-sizing: border-box;
        color: var(--color-content-content-primary);
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        margin-top: -16px;
        letter-spacing: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

`
