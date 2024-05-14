import { AnimationType } from './animation-type';
import { appendStyle } from '@one-inch-community/lit';

export function slideAnimation(): AnimationType {
  const initStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    zIndex: '9',
    backfaceVisibility: 'hidden'
  }
  const resetStyle = {
    position: '',
    top: '',
    left: '',
    bottom: '',
    right: '',
    zIndex: '',
    transform: '',
    filter: '',
    backfaceVisibility: '',
    willChange: ''
  }
  const animationConfig: KeyframeAnimationOptions = {
    duration: 600,
    easing: 'cubic-bezier(.2, .8, .2, 1)'
  }

  return {
    beforeAppend: async (upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean) => {
      appendStyle(upLayer, {
        ...initStyle,
        zIndex: '9',
        transform: isBack ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)'
      })
      appendStyle(downLayer, {
        ...initStyle,
        zIndex: '8',
        willChange: 'transform, filter',
        transform: isBack ? 'translate3d(-50%, 0, 0) scale(.9)' : 'translate3d(0, 0, 0) scale(1)',
        filter: isBack ? 'blur(3px)' : 'blur(0)'
      })
    },
    afterAppend: async (upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean) => {
      await Promise.all([
        upLayer.animate([
          { transform: isBack ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)' },
          { transform: isBack ? 'translate3d(100%, 0, 0)' : 'translate3d(0, 0, 0)' },
        ], animationConfig).finished,
        downLayer.animate([
          {
            transform: isBack ? 'translate3d(-50%, 0, 0) scale(.9)' : 'translate3d(0, 0, 0) scale(1)',
            filter: isBack ? 'blur(3px)' : 'blur(0)'
          },
          {
            transform: isBack ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(-50%, 0, 0) scale(.9)',
            filter: isBack ? 'blur(0)' : 'blur(3px)'
          },
        ], animationConfig).finished
      ])

      appendStyle(upLayer, { ...resetStyle })
      appendStyle(downLayer, { ...resetStyle })
    }
  }
}
