import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { appendStyle } from '../lit/append-style';
import { getContainer } from './overlay-container';
import { getOverlayId } from './overlay-id-generator';
import { fromEvent, Subscription } from 'rxjs';

export class OverlayDesktopController implements IOverlayController {

  get isOpen() {
    return this.activeOverlayMap.size > 0
  }

  private readonly activeOverlayMap = new Map<number, HTMLElement>()
  private readonly subscriptions = new Map<number, Subscription>()

  private readonly container = getContainer()

  constructor(private readonly target: HTMLElement | 'center',
              private readonly rootNodeName: string) {
  }

  isOpenOverlay(overlayId: number): boolean {
    return this.activeOverlayMap.has(overlayId)
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<number> {
    const position = await this.getPosition(openTarget)
    const overlayContainer = this.createOverlayContainer(openTarget)
    if (this.target === 'center') {
      appendStyle(overlayContainer, {
        top: `0px`,
        left: `0px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      })
    } else {
      appendStyle(overlayContainer, {
        top: `${position[1]}px`,
        left: `${position[0]}px`,
        borderRadius: '24px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.12), 0px 4px 12px 0px rgba(0, 0, 0, 0.12)'
      })
    }

    await this.animateEnter(overlayContainer)

    const id = getOverlayId()
    this.activeOverlayMap.set(id, overlayContainer)
    this.subscribe(id)
    return id
  }

  async close(overlayId: number) {
    if (!this.activeOverlayMap.has(overlayId)) {
      return
    }
    const overlayContainer = this.activeOverlayMap.get(overlayId)!

    await this.animateLeave(overlayContainer)

    this.unsubscribe(overlayId)
    overlayContainer.remove();
    this.activeOverlayMap.delete(overlayId)
  }

  private async getPosition(openTarget: TemplateResult | HTMLElement) {
    if (this.target === 'center') {
      return [0, 0]
    }
    const rect = this.target.getBoundingClientRect()
    const rectContent = await this.getRect(openTarget)
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
      height: 'fit-content'
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }

  private subscribe(overlayId: number) {
    const subscription = new Subscription()
    const overlayContainer = this.activeOverlayMap.get(overlayId)
    if (!overlayContainer) return;
    if (this.target === 'center') {
      subscription.add(
        fromEvent(overlayContainer, 'click').subscribe((event) => {
          if (event.target !== overlayContainer) return
          this.close(overlayId).catch()
        })
      )
      return
    }
    subscription.add(
      fromEvent(window, 'resize').subscribe(() => this.close(overlayId).catch()),
    )
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    subscription.add(
      fromEvent(rootNode, 'scroll').subscribe(() => this.updatePosition(overlayId)),
    )
    subscription.add(
      fromEvent(overlayContainer, 'click').subscribe((event) => {
        event.stopPropagation()
        event.preventDefault()
      }),
    )
    subscription.add(
      fromEvent(document, 'click').subscribe(() => {
        this.close(overlayId).catch()
      }),
    )
    this.subscriptions.set(overlayId, subscription)
  }

  private unsubscribe(overlayId: number) {
    if (!this.subscriptions.has(overlayId)) return
    const subscription = this.subscriptions.get(overlayId)!
    if (subscription.closed) return;
    subscription.unsubscribe()
  }

  private updatePosition(overlayId: number) {
    if (this.target === 'center') return;
    if (!this.activeOverlayMap.has(overlayId)) {
      return
    }
    const overlayContainer = this.activeOverlayMap.get(overlayId)!
    const rect = this.target.getBoundingClientRect()
    const rectContent = overlayContainer.getBoundingClientRect()
    const top = rect.top + rect.height + 8
    const left = rect.right - (rectContent.width)
    appendStyle(overlayContainer, {
      top: `${top}px`,
      left: `${left}px`,
    })
  }

  private async animateEnter(overlayContainer: HTMLElement) {
    const options = {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
    if (this.target === 'center') {
      const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
      await Promise.all([
        rootNode.animate([
          {filter: 'blur(0)'},
          {filter: 'blur(3px)'},
        ], options),
        overlayContainer.animate([
          {transform: 'scale(.3)', opacity: 0.3},
          {transform: 'scale(1)', opacity: 1},
        ], options).finished
      ])
      appendStyle(rootNode, {
        filter: 'blur(3px)'
      })
      return
    }

    await overlayContainer.animate([
      {clipPath: 'circle(0 at 90% 0)', opacity: 0.3},
      {clipPath: `circle(100%)`, opacity: 1},
    ], options).finished
  }

  private async animateLeave(overlayContainer: HTMLElement) {
    const options = {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
    if (this.target === 'center') {
      const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
      await Promise.all([
        rootNode.animate([
          {filter: 'blur(3px)'},
          {filter: 'blur(0)'},
        ], options),
        overlayContainer.animate([
          {transform: 'scale(1)', opacity: 1},
          {transform: 'scale(0)', opacity: 0},
        ], {
          ...options,
          duration: 300,
        }).finished
      ])
      appendStyle(rootNode, {
        filter: ''
      })
      return
    }

    await overlayContainer.animate([
      {clipPath: `circle(100%)`, opacity: 1},
      {clipPath: 'circle(0 at 90% 0)', opacity: 0.3},
    ],options).finished
  }

}