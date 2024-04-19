import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { appendStyle } from '../lit/append-style';
import { getContainer } from './overlay-container';
import { getOverlayId } from './overlay-id-generator';
import { fromEvent, Subscription, tap } from 'rxjs';

export class OverlayDesktopController implements IOverlayController {

  get isOpen() {
    return this.activeOverlayMap.size > 0
  }

  private readonly activeOverlayMap = new Map<number, HTMLElement>()
  private readonly subscriptions = new Map<number, Subscription>()

  private readonly container = getContainer()

  constructor(private readonly target: HTMLElement | 'center') {
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<number> {
    const position = await this.getPosition(openTarget)
    const overlayContainer = this.createOverlayContainer(openTarget)
    appendStyle(overlayContainer, {
      top: `${position[1]}px`,
      left: `${position[0]}px`,
    })

    await overlayContainer.animate([
      {clipPath: 'circle(0 at 90% 0)', opacity: 0},
      {clipPath: `circle(100%)`, opacity: 1},
    ],{
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }).finished

    const id = getOverlayId()
    this.subscribeOnResize(id)
    this.activeOverlayMap.set(id, overlayContainer)
    return id
  }

  async close(overlayId: number) {
    if (!this.activeOverlayMap.has(overlayId)) {
      return
    }
    const overlayContainer = this.activeOverlayMap.get(overlayId)!

    await overlayContainer.animate([
      {clipPath: `circle(100%)`, opacity: 1},
      {clipPath: 'circle(0 at 90% 0)', opacity: 0},
    ],{
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }).finished

    this.unsubscribeOnResize(overlayId)
    overlayContainer.remove();
    this.activeOverlayMap.delete(overlayId)
  }

  private async getPosition(openTarget: TemplateResult | HTMLElement) {
    if (this.target === 'center') {
      return [0, 0]
    }
    const rect = this.target.getBoundingClientRect()
    const rectContent = await this.getRect(openTarget)
    console.log(rectContent)
    return [
      rect.right - (rectContent.width),
      rect.top + rect.height + 8
    ]
  }

  private async getRect(openTarget: TemplateResult | HTMLElement) {
    const el = this.createOverlayContainer(openTarget)
    appendStyle(el, {
      visibility: 'hidden',
    })
    document.body.appendChild(el)
    await new Promise(resolve => requestAnimationFrame(resolve))
    const rect = el.getBoundingClientRect();
    el.remove()
    return rect;
  }

  private createOverlayContainer(openTarget: TemplateResult | HTMLElement) {
    const overlayContainer = document.createElement('div')
    appendStyle(overlayContainer, {
      position: 'absolute',
      display: 'flex',
      overflow: 'hidden',
      alignItems: 'flex-end',
      width: 'fit-content',
      height: 'fit-content',
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }

  private subscribeOnResize(overlayId: number) {
    if (this.target === 'center') return;
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
    if (this.target === 'center') return;
    this.close(overlayId).catch()
  }

}