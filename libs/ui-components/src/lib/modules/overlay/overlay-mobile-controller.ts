import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { getContainer } from './overlay-container';
import { appendStyle } from '../lit/append-style';
import { getOverlayId } from './overlay-id-generator';
import { fromEvent, Subscription, tap } from 'rxjs';

export class OverlayMobileController implements IOverlayController {

  private readonly container = getContainer()

  get isOpen() {
    return this.activeOverlayMap.size > 0
  }

  private readonly activeOverlayMap = new Map<number, HTMLElement>()
  private readonly subscriptions = new Map<number, Subscription>()

  constructor(private readonly rootNodeName: string) {
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<number> {
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const overlayContainer = this.createOverlayContainer(openTarget)
    appendStyle(rootNode, {
      overflow: 'hidden',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
    })
    const options = {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
    await Promise.all([
      overlayContainer.animate([
        { transform: 'translate3d(0, 100%, 0)' },
        { transform: 'translate3d(0, 0, 0)' },
      ], options).finished,
      rootNode.animate([
        { filter: 'blur(0)', transform: 'scale(1) translate3d(0, 0, 0)' },
        { filter: 'blur(3px)', transform: 'scale(.9) translate3d(0, -6%, 0)' },
      ], options).finished
    ])
    appendStyle(rootNode, {
      filter: 'blur(3px)',
      transform: 'scale(.9) translate3d(0, -6%, 0)',
      willChange: 'filter, transform',
    })
    const id = getOverlayId()
    this.subscribeOnResize(id)
    this.activeOverlayMap.set(id, overlayContainer)
    return id
  }

  async close(overlayId: number): Promise<void> {
    if (!this.activeOverlayMap.has(overlayId)) {
      return
    }
    const overlayContainer = this.activeOverlayMap.get(overlayId)!
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const options = {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
    await Promise.all([
      overlayContainer.animate([
        { transform: 'translate3d(0, 0, 0)' },
        { transform: 'translate3d(0, 100%, 0)' },
      ], options).finished,
      rootNode.animate([
        { filter: 'blur(3px)', transform: 'scale(.9) translate3d(0, -6%, 0)' },
        { filter: 'blur(0)', transform: 'scale(1) translate3d(0, 0, 0)' },
      ],options).finished
    ])
    appendStyle(rootNode, {
      filter: '',
      transform: '',
      position: '',
      willChange: '',
      overflow: '',
      top: '',
      left: '',
      right: '',
      bottom: '',
    })
    this.unsubscribeOnResize(overlayId)
    overlayContainer.remove()
    this.activeOverlayMap.delete(overlayId)
  }

  private createOverlayContainer(openTarget: TemplateResult | HTMLElement) {
    const overlayContainer = document.createElement('div')
    appendStyle(overlayContainer, {
      position: 'fixed',
      display: 'flex',
      width: '100vw',
      height: '97%',
      overflow: 'hidden',
      alignItems: 'flex-end',
      bottom: '0',
      left: '0'
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }


  private subscribeOnResize(overlayId: number) {
    const subscription = fromEvent(window, 'resize').pipe(
      tap(() => this.updatePosition(overlayId))
    ).subscribe()
    this.subscriptions.set(overlayId, subscription)
  }

  private unsubscribeOnResize(overlayId: number) {
    if (!this.subscriptions.has(overlayId)) return
    const subscription = this.subscriptions.get(overlayId)!
    if (subscription.closed) return;
    subscription.unsubscribe()
  }

  private updatePosition(overlayId: number) {
    if (!this.subscriptions.has(overlayId)) return
    this.close(overlayId).catch()
  }

}