import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { getContainer } from './overlay-container';
import { appendStyle } from '../lit/append-style';

export class OverlayMobileController implements IOverlayController {

  private readonly container = getContainer()

  constructor(private readonly rootNodeName: string) {
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<() => Promise<void>> {
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const overlayContainer = this.createOverlayContainer(openTarget)
    await Promise.all([
      overlayContainer.animate([
        { transform: 'translate3d(0, 100%, 0)' },
        { transform: 'translate3d(0, 0, 0)' },
      ], {
        duration: 500,
        easing: 'cubic-bezier(.2, .8, .2, 1)'
      }).finished,
      rootNode.animate([
        { filter: 'blur(0)', transform: 'scale(1) translate3d(0, 0, 0)' },
        { filter: 'blur(3px)', transform: 'scale(.9) translate3d(0, -6%, 0)' },
      ],{
        duration: 500,
        easing: 'cubic-bezier(.2, .8, .2, 1)'
      }).finished
    ])
    appendStyle(rootNode, {
      filter: 'blur(3px)',
      transform: 'scale(.9) translate3d(0, -6%, 0)',
      position: 'fixed',
      willChange: 'filter, transform'
    })

    return async () => {
      await Promise.all([
        overlayContainer.animate([
          { transform: 'translate3d(0, 0, 0)' },
          { transform: 'translate3d(0, 100%, 0)' },
        ], {
          duration: 500,
          easing: 'cubic-bezier(.2, .8, .2, 1)'
        }).finished,
        rootNode.animate([
          { filter: 'blur(3px)', transform: 'scale(.9) translate3d(0, -6%, 0)' },
          { filter: 'blur(0)', transform: 'scale(1) translate3d(0, 0, 0)' },
        ],{
          duration: 500,
          easing: 'cubic-bezier(.2, .8, .2, 1)'
        }).finished
      ])
      appendStyle(rootNode, {
        filter: '',
        transform: '',
        position: '',
        willChange: ''
      })
      overlayContainer.remove()
    }
  }

  private createOverlayContainer(openTarget: TemplateResult | HTMLElement) {
    const overlayContainer = document.createElement('div')
    appendStyle(overlayContainer, {
      position: 'fixed',
      display: 'flex',
      width: '100vw',
      height: '97%',
      overflow: 'hidden',
      bottom: '0',
      left: '0'
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }

}