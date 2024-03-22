import { css } from 'lit';

export const sceneStyle = css`

    .scene-container {
        min-height: 50px;
        min-width: 50px;
        position: relative;
        overflow: hidden;
        transition: height .2s, width .2s;
    }

    .scene-wrapper {
    }
    
    .scene-wrapper-hidden {
        transform: translateX(100%);
    }

    .scene-wrapper-animate {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        animation: show .2s ease-out;
    }
    
    .scene-wrapper-animate-back {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        animation: show-back .2s ease-out;
    }
    
    @keyframes show {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes show-back {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(100%);
        }
    }
    
    .scene-wrapper-header {
        height: 68px;
        display: flex;
        align-items: center;
    }

`