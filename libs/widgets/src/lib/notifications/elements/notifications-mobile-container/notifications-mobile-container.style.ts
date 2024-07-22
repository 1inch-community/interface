import { css } from 'lit';

export const notificationsMobileContainerStyle = css`

    :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3000;
        display: grid;
        flex-direction: column;
        overflow-x: hidden;
    }

    .touch-container {
        position: relative;
        padding: 8px;
        box-sizing: border-box;
        max-width: 100vw;
   /*     transition: transform .2s;*/
    }
    
    .background-view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100vh;
        transition: background-color .2s;
        z-index: -1000;
    }

    .info-view {
        display: flex;
        width: 100%;
        height: 48px;
    }
`
