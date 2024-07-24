import { Animation } from './animation';
import { appendStyle, isSafari } from '@one-inch-community/core/lit';

export function shiftAnimation(): Animation {
  const initStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    zIndex: '9',
    backfaceVisibility: 'hidden',
    height: isSafari() ? '110%' : ''
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
    height: ''
  }
  const animationConfig: KeyframeAnimationOptions = {
    duration: 500,
    easing: 'cubic-bezier(.2, .8, .2, 1)'
  }

  return {
    preparation: async (upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean) => {
      appendStyle(upLayer, {
        ...initStyle,
        zIndex: '9',
        transform: isBack ? 'translate3d(0, 0, 0)' : 'translate3d(110%, 0, 0)'
      })
      appendStyle(downLayer, {
        ...initStyle,
        zIndex: '8',
        transform: isBack ? 'translate3d(-110%, 0, 0)' : 'translate3d(0, 0, 0)',
      })
    },
    transition: async (upLayer: HTMLElement, downLayer: HTMLElement, isBack: boolean) => {
      await Promise.all([
        upLayer.animate([
          { transform: isBack ? 'translate3d(0, 0, 0)' : 'translate3d(110%, 0, 0)' },
          { transform: isBack ? 'translate3d(110%, 0, 0)' : 'translate3d(0, 0, 0)' },
        ], animationConfig),
        downLayer.animate([
          {
            transform: isBack ? 'translate3d(-110%, 0, 0)' : 'translate3d(0, 0, 0)',
          },
          {
            transform: isBack ? 'translate3d(0, 0, 0)' : 'translate3d(-110%, 0, 0)',
          },
        ], animationConfig).finished
      ])

      appendStyle(upLayer, { ...resetStyle })
      appendStyle(downLayer, { ...resetStyle })
    }
  }
}
