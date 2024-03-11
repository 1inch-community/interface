import { css } from 'lit';

export const segmentedControlContainerStyle = css`
    :host {
        display: block;
    }
    
    .container {
        position: relative;
        background-color: var(--color-background-bg-secondary);
        padding: 2px;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        outline: none;
        box-sizing: border-box;
        width: 100%;
    }
    
    .container-m {
        border-radius: 10px;
        height: 36px;
    }
    
    .container-l {
        border-radius: 12px;
        height: 48px;
    }
    
    .caret {
        position: absolute;
        background-color: var(--color-background-bg-active);
        height: 32px;
        border-radius: 8px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 1px 4px 0 rgba(0, 0, 0, 0.12);
        color: var(--primary);
        width: 30px;
        z-index: 0;
    }

    .caret-transition {
        transition: transform .2s;
    }
    
`

export const segmentedControlItemStyle = css`

    .item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-items: center;
        padding: 6px 16px;
        z-index: 1;
        width: 100%;
        justify-content: center;
        text-wrap: nowrap;
        transition: color .2s, background-color .2s;
        color: var(--color-content-content-primary);
    }
    
    .select {
        color: var(--primary);
    }
    
    .item-input {
        user-select: none;
        outline: none;
        border: none;
        background-color: transparent;
    }

`