import { css } from 'lit';

export const notificationsDesktopContainerStyle = css`
  
  :host {
      --top-offset: 72px;
      position: fixed;
      z-index: 2000;
      padding-top: 72px;
      padding-right: 8px;
      top: 0;
      right: 0;
      height: 100vh;
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-x: hidden;
      pointer-events: none;
  }
    
    .close-button-container {
        pointer-events: all;
        margin-left: auto;
    }
    
    .notification-close-container {
        position: relative;
    }
    
    .close-notification-button {
        pointer-events: all;
        position: absolute;
        top: -8px;
        right: -8px;
        transform: scale(0);
        transition: transform .2s;
    }
    
    .notification-container {
        pointer-events: all;
        color: var(--color-content-content-primary);
        background-color: var(--color-background-bg-primary);
        border-radius: 8px;
        padding: 8px;
        box-sizing: border-box;
        width: 100%;
        min-height: 50px;
        border: 1px solid var(--primary-12);
        transition: border .2s;
    }
    
    @media (hover: hover) {
        .notification-container:hover {
            border: 1px solid var(--primary-50);
        }
        .notification-close-container:hover .close-notification-button {
            transform: scale(1);
        }
    }
  
`
