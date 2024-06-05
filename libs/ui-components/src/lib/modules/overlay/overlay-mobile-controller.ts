import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { getContainer } from './overlay-container';
import { appendStyle, resizeObserver } from '@one-inch-community/lit';
import { asyncFrame } from '@one-inch-community/ui-components/async';
import { getOverlayId } from './overlay-id-generator';
import { fromEvent, Subscription, tap, merge, filter, map, distinctUntilChanged, switchMap, skip } from 'rxjs';
import { ScrollViewProviderElement } from '@one-inch-community/ui-components/scroll';

export class OverlayMobileController implements IOverlayController {

  private readonly container = getContainer()

  get isOpen() {
    return this.activeOverlayMap.size > 0
  }

  private readonly activeOverlayMap = new Map<number, ScrollViewProviderElement>()
  private readonly subscriptions = new Map<number, Subscription>()

  constructor(private readonly rootNodeName: string) {
  }

  isOpenOverlay(overlayId: number): boolean {
    return this.activeOverlayMap.has(overlayId)
  }

  async open(openTarget: TemplateResult | HTMLElement): Promise<number> {
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const overlayContainer = this.createOverlayContainer(openTarget)
    await asyncFrame()
    const halfView = this.calculateIsHalfView(overlayContainer)
    this.appendStyleBeforeTransition(rootNode)
    await this.transition(overlayContainer, rootNode, false, halfView)
    this.appendStyleAfterTransition(rootNode, false, halfView)
    const id = getOverlayId()
    this.activeOverlayMap.set(id, overlayContainer)
    this.subscribeOnEvents(id)
    return id
  }

  async close(overlayId: number): Promise<void> {
    if (!this.activeOverlayMap.has(overlayId)) {
      return
    }
    const overlayContainer = this.activeOverlayMap.get(overlayId)!
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const halfView = this.calculateIsHalfView(overlayContainer)
    await this.transition(overlayContainer, rootNode, true, halfView)
    this.appendStyleAfterTransition(rootNode, true, halfView)
    this.unsubscribeOnResize(overlayId)
    overlayContainer.remove()
    this.activeOverlayMap.delete(overlayId)
  }

  private createOverlayContainer(openTarget: TemplateResult | HTMLElement) {
    const overlayContainer = document.createElement(ScrollViewProviderElement.tagName)
    const overlayIndex = this.activeOverlayMap.size + 1
    const offsetStep = 2
    overlayContainer.maxHeight = (100 - (overlayIndex * offsetStep)) * window.innerHeight / 100
    overlayContainer.setAttribute('overlay-index', overlayIndex.toString())
    appendStyle(overlayContainer, {
      position: 'fixed',
      display: 'flex',
      width: '100vw',
      overflow: 'hidden',
      alignItems: 'flex-end',
      bottom: '0',
      left: '0',
      boxSizing: 'border-box',
      boxShadow: '0 -3px 4px 0 var(--primary-12), 0 6px 12px 0 var(--primary-12)',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }


  private subscribeOnEvents(overlayId: number) {
    const overlayContainer = this.activeOverlayMap.get(overlayId)!
    const subscription = merge(
      fromEvent(window, 'resize').pipe(
        tap(() => this.updatePosition(overlayId))
      ),
      resizeObserver(overlayContainer).pipe(
        filter(() => {
          const overlayIndex = Number(overlayContainer.getAttribute('overlay-index'))
          return overlayIndex === this.activeOverlayMap.size
        }),
        map(() => this.calculateIsHalfView(overlayContainer)),
        distinctUntilChanged(),
        skip(1),
        switchMap((halfView) => {
          const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
          return this.transitionHalfView(rootNode, halfView)
        })
      ),
      fromEvent(this.container, 'click').pipe(
        filter(() => {
          const overlayIndex = Number(overlayContainer.getAttribute('overlay-index'))
          return overlayIndex === this.activeOverlayMap.size
        }),
        filter(event => event.target === this.container),
        tap(() => this.updatePosition(overlayId))
      )
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

  private calculateIsHalfView(element: ScrollViewProviderElement): boolean {
    const height = element.clientHeight
    const maxHeight = element.maxHeight ?? 0
    return (height * 100 / maxHeight) < 70
  }

  private getDefaultAnimationOptions() {
    return {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
  }

  private async transition(overlayContainer: HTMLElement, rootNode: HTMLElement, isBack: boolean, halfView: boolean) {
    const blur = '3px'
    const scale = '.9'
    const offset = '-6%'
    const transitionOverlayContainerStart = () => ({ transform: `translate3d(0, ${isBack ? '0' : '100%'}, 0)` })
    const transitionOverlayContainerEnd = () => ({ transform: `translate3d(0, ${!isBack ? '0' : '100%'}, 0)` })
    const transitionRootNodeStart = () => ({ filter: `blur(${isBack ? blur : '0'})`, transform: halfView ? '' : `scale(${isBack ? scale : '1'}) translate3d(0, ${isBack ? offset : '0'}, 0)` })
    const transitionRootNodeEnd = () => ({ filter: `blur(${!isBack ? blur : '0'})`, transform: halfView ? '' : `scale(${!isBack ? scale : '1'}) translate3d(0, ${!isBack ? offset : '0'}, 0)` })
    return await Promise.all([
      overlayContainer.animate([
        transitionOverlayContainerStart(),
        transitionOverlayContainerEnd(),
      ], this.getDefaultAnimationOptions()).finished,
      rootNode.animate([
        transitionRootNodeStart(),
        transitionRootNodeEnd(),
      ],this.getDefaultAnimationOptions()).finished
    ])
  }

  private async transitionHalfView(rootNode: HTMLElement, isBack: boolean) {
    const scale = '.9'
    const offset = '-6%'
    const transitionRootNodeStart = () => ({ transform: `scale(${isBack ? scale : '1'}) translate3d(0, ${isBack ? offset : '0'}, 0)` })
    const transitionRootNodeEnd = () => ({ transform: `scale(${!isBack ? scale : '1'}) translate3d(0, ${!isBack ? offset : '0'}, 0)` })
    await rootNode.animate([
      transitionRootNodeStart(),
      transitionRootNodeEnd()
    ],this.getDefaultAnimationOptions()).finished
    appendStyle(rootNode, transitionRootNodeEnd())
  }

  private appendStyleBeforeTransition(rootNode: HTMLElement) {
    appendStyle(rootNode, {
      willChange: 'filter, transform',
      overflow: 'hidden',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      pointerEvents: 'none',
    })
    appendStyle(this.container, {
      position: 'fixed',
      width: '100%',
      height: '100%'
    })
  }

  private appendStyleAfterTransition(rootNode: HTMLElement, isBack: boolean, halfView: boolean) {
    if (isBack) {
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
        zIndex: '',
        pointerEvents: '',
      })
      appendStyle(this.container, {
        position: '',
        width: '',
        height: ''
      })
      return
    }
    appendStyle(rootNode, {
      filter: 'blur(3px)',
      transform: halfView ? '' : 'scale(.9) translate3d(0, -6%, 0)'
    })
  }

}
