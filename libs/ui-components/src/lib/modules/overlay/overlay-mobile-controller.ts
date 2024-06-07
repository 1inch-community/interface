import { IOverlayController } from './overlay-controller.interface';
import { html, render, TemplateResult } from 'lit';
import { getContainer } from './overlay-container';
import { appendStyle, getMobileMatchMediaEmitter, resizeObserver, setBrowserMetaColorColor } from '@one-inch-community/lit';
import { asyncFrame } from '@one-inch-community/ui-components/async';
import { getBrowserMetaColor, applyColorBrightness, interpolateColorRange, getCssValue } from '@one-inch-community/ui-components/theme';
import { getOverlayId } from './overlay-id-generator';
import {
  fromEvent,
  Subscription,
  tap,
  merge,
  filter,
  map,
  distinctUntilChanged,
  switchMap,
  skip,
  takeUntil
} from 'rxjs';
import { ScrollViewProviderElement } from '@one-inch-community/ui-components/scroll';

export class OverlayMobileController implements IOverlayController {

  private readonly borderRadius = '8px'
  private readonly brightnessHalfView = '.7'
  private readonly scale = '.9'
  private readonly topOffsetPercent = -5
  private readonly backgroundColor = 'var(--color-background-bg-active)'
  private readonly backgroundColorDefault = 'var(--color-background-bg-body)'

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
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
    })
    render(html`${openTarget}`, overlayContainer)
    this.container.appendChild(overlayContainer)
    return overlayContainer
  }


  private subscribeOnEvents(overlayId: number) {
    const overlayContainer = this.activeOverlayMap.get(overlayId)!
    const rootNode = document.querySelector(this.rootNodeName) as HTMLElement
    const subscription = merge(
      //
      getMobileMatchMediaEmitter().pipe(
        tap(() => this.updatePosition(overlayId))
      ),
      //
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
      //
      fromEvent(this.container, 'click').pipe(
        filter(() => {
          const overlayIndex = Number(overlayContainer.getAttribute('overlay-index'))
          return overlayIndex === this.activeOverlayMap.size
        }),
        filter(event => event.target === this.container),
        tap(() => this.updatePosition(overlayId))
      ),
      //
      fromEvent<TouchEvent>(overlayContainer, 'touchstart', { passive: true }).pipe(
        filter(() => (overlayContainer.scrollTopFromConsumer ?? 0) === 0),
        switchMap(startEvent => {
          const halfView = this.calculateIsHalfView(overlayContainer)
          const overlayContainerHeight = overlayContainer.clientHeight
          const swipeMaxForClose = 30
          const startPoint = startEvent.touches[0].clientY
          const bgColorStart = getCssValue(this.backgroundColor)
          const bgColorEnd = getCssValue(this.backgroundColorDefault)
          let currentDelta = 0
          let currentDeltaPoint = 0
          let closeReady = false
          let scale = Number(this.scale)
          let offset = this.topOffsetPercent
          let bgColor = this.backgroundColor
          return fromEvent<TouchEvent>(overlayContainer, 'touchmove', { passive: true }).pipe(
            filter(() => !closeReady),
            tap(event => {
              const currentPoint = event.touches[0].clientY
              const deltaPoint = currentPoint - startPoint
              const delta = deltaPoint * 100 / overlayContainerHeight
              if (delta < 0) return
              if (delta > swipeMaxForClose) {
                closeReady = true
                this.updatePosition(overlayId)
              }
              currentDelta = delta
              currentDeltaPoint = deltaPoint
              overlayContainer.setAttribute('offset', delta.toString())
              appendStyle(overlayContainer, {
                transform: `translateY(${deltaPoint}px)`
              })
              if (!halfView) {
                scale = ((delta * (1 - Number(this.scale))) / swipeMaxForClose) + Number(this.scale)
                offset = this.topOffsetPercent - ((delta * this.topOffsetPercent) / swipeMaxForClose)
                bgColor = interpolateColorRange(bgColorStart, bgColorEnd, 0, 100, delta)
                rootNode.setAttribute('scale', scale.toString())
                rootNode.setAttribute('offset', offset.toString())
                rootNode.setAttribute('bgColor', bgColor.toString())
                appendStyle(rootNode, {
                  transform: `scale(${scale}) translate3d(0, ${offset}%, 0)`,
                  backgroundColor: bgColor
                })
              }
            }),
            takeUntil(merge(
              fromEvent<TouchEvent>(overlayContainer, 'touchend', { passive: true }),
              fromEvent<TouchEvent>(overlayContainer, 'touchcancel', { passive: true })
            ).pipe(
              switchMap(async (endEvent) => {
                if (currentDeltaPoint === 0) return
                if (endEvent.timeStamp - startEvent.timeStamp < 300 && currentDelta > (swipeMaxForClose / 2)) {
                  this.updatePosition(overlayId)
                  return
                }
                if (closeReady) return
                await Promise.all([
                  overlayContainer.animate([
                    { transform: `translateY(${currentDeltaPoint}px)` },
                    { transform: `translateY(0px)` }
                  ], this.getDefaultAnimationOptions()).finished,
                  !halfView ? rootNode.animate([
                    { transform: `scale(${scale}) translate3d(0, ${offset}%, 0)`, backgroundColor: bgColor },
                    { transform: `scale(${this.scale}) translate3d(0, ${this.topOffsetPercent}%, 0)`,  backgroundColor: this.backgroundColor },
                  ], this.getDefaultAnimationOptions()).finished : Promise.resolve()
                ])
                overlayContainer.removeAttribute('offset')
                appendStyle(overlayContainer, {
                  transform: ``
                })
                if (!halfView) {
                  rootNode.removeAttribute('scale')
                  rootNode.removeAttribute('offset')
                  rootNode.removeAttribute('bgColor')
                  appendStyle(rootNode, {
                    transform: `scale(${this.scale}) translate3d(0, ${this.topOffsetPercent}%, 0)`,
                    backgroundColor: this.backgroundColor
                  })
                }
              })
            ))
          )
        })
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
    return (height * 100 / maxHeight) < 90
  }

  private getDefaultAnimationOptions() {
    return {
      duration: 500,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }
  }

  private async transition(overlayContainer: HTMLElement, rootNode: HTMLElement, isBack: boolean, halfView: boolean) {
    const scale = rootNode.getAttribute('scale') ?? this.scale
    const brightnessHalfView = this.brightnessHalfView
    const offset = Number(rootNode.getAttribute('offset') ?? this.topOffsetPercent)
    const backgroundColor = rootNode.getAttribute('bgColor') ?? this.backgroundColor
    const mainOverlayOffset = overlayContainer.getAttribute('offset') ?? '0'
    const transitionOverlayContainerStart = () => ({ transform: `translate3d(0, ${isBack ? mainOverlayOffset : '100'}%, 0)` })
    const transitionOverlayContainerEnd = () => ({ transform: `translate3d(0, ${!isBack ? mainOverlayOffset : '100'}%, 0)` })
    const transitionRootNodeStart = () => ({
      filter: halfView ? `brightness(${isBack ? brightnessHalfView : '1'})` : '',
      transform: halfView ? '' : `scale(${isBack ? scale : '1'}) translate3d(0, ${isBack ? offset : '0'}%, 0)`,
      borderRadius: halfView ? '' : isBack ? this.borderRadius : '0',
      backgroundColor: halfView ? '' : isBack ? backgroundColor : this.backgroundColorDefault
    })
    const transitionRootNodeEnd = () => ({
      filter: halfView ? `brightness(${!isBack ? brightnessHalfView : '1'})` : '',
      transform: halfView ? '' : `scale(${!isBack ? scale : '1'}) translate3d(0, ${!isBack ? offset : '0'}%, 0)`,
      borderRadius: halfView ? '' : !isBack ? this.borderRadius : '0',
      backgroundColor: halfView ? '' : !isBack ? backgroundColor : this.backgroundColorDefault
    })
    this.changeBrowserMetaColor(halfView, isBack)
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
    const scale = this.scale
    const brightnessHalfView = this.brightnessHalfView
    const offset = this.topOffsetPercent
    const transitionRootNodeStart = () => ({
      filter: `brightness(${!isBack ? brightnessHalfView : '1'})`,
      transform: `scale(${isBack ? scale : '1'}) translate3d(0, ${isBack ? offset : '0'}%, 0)`,
      borderRadius: isBack ? this.borderRadius : '0',
      backgroundColor: isBack ? this.backgroundColor : this.backgroundColorDefault
    })
    const transitionRootNodeEnd = () => ({
      filter: `brightness(${isBack ? brightnessHalfView : '1'})`,
      transform: `scale(${!isBack ? scale : '1'}) translate3d(0, ${!isBack ? offset : '0'}%, 0)`,
      borderRadius: !isBack ? this.borderRadius : '0',
      backgroundColor: !isBack ? this.backgroundColor : this.backgroundColorDefault
    })
    this.changeBrowserMetaColor(isBack, false)
    await rootNode.animate([
      transitionRootNodeStart(),
      transitionRootNodeEnd(),
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
    rootNode.removeAttribute('scale')
    rootNode.removeAttribute('offset')
    rootNode.removeAttribute('bgColor')
  }

  private appendStyleAfterTransition(rootNode: HTMLElement, isBack: boolean, halfView: boolean) {
    if (isBack) {
      return this.resetRootNodeStyle(rootNode)
    }
    appendStyle(rootNode, {
      filter: halfView ? `brightness(${this.brightnessHalfView})` : '',
      transform: halfView ? '' : `scale(${this.scale}) translate3d(0, ${this.topOffsetPercent}%, 0)`,
      borderRadius: halfView ? '' : this.borderRadius,
      backgroundColor: halfView ? '' : this.backgroundColor
    })
  }

  private changeBrowserMetaColor(halfView: boolean, isBack: boolean) {
    let color = getBrowserMetaColor()
    if (halfView && !isBack) {
      color = applyColorBrightness(color, parseFloat(this.brightnessHalfView))
    }
    setBrowserMetaColorColor(color)
  }

  private resetRootNodeStyle(rootNode: HTMLElement) {
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
      backgroundColor: '',
      borderRadius: ''
    })
  }

}
