import { directive, Directive, PartInfo } from 'lit/directive.js';
import { html, render, TemplateResult } from 'lit';
import { appendStyle } from '../append-style';

export type AnimationMapDirection = 'horizontal' | 'vertical'
export interface AnimationMapController<Value, RenderState = void, RemoveState = void, MoveState = void> {
  readonly direction: AnimationMapDirection
  onKeyExtractor(value: Value, index: number): string
  onTemplateBuilder(value: Value, index: number): TemplateResult

  onBeforeRemoveAnimateItem(element: HTMLElement, index: number): Promise<RemoveState>
  onAfterRemoveAnimateItem?(element: HTMLElement, index: number, previousStepState: void | RemoveState): Promise<void>

  onBeforeRenderAnimateItem(element: HTMLElement, index: number): Promise<RenderState>
  onAfterRenderAnimateItem?(element: HTMLElement, index: number, previousStepState: void | RenderState): Promise<void>

  onBeforeMoveAnimationItem?(element: HTMLElement, oldPosition: number, newPosition: number): Promise<MoveState>
  onAfterMoveAnimationItem?(element: HTMLElement, previousStepState: void | MoveState): Promise<void>

  onBeforeAnimation?(container: HTMLElement, renderElements: Map<number, HTMLElement>, deleteElements: Map<number, HTMLElement>, moveElements: Map<[number, number], HTMLElement>): Promise<void>
  onAfterAnimation?(container: HTMLElement, renderElements: Map<number, HTMLElement>, deleteElements: Map<number, HTMLElement>, moveElements: Map<[number, number], HTMLElement>): Promise<void>

  onAnimationStart?(): Promise<void> | void
  onAnimationComplete?(): Promise<void> | void
}

export class AnimationMap<Value> extends Directive {

  private readonly view = document.createElement('div')
  private lock = false

  constructor(partInfo: PartInfo) {
    super(partInfo);
    appendStyle(this.view, {
      display: 'flex',
      gap: '8px',
      position: 'relative'
    })
  }

  override render(
    items: Iterable<Value>,
    controller: AnimationMapController<Value>
  ): TemplateResult {
    this.applyDirection(controller.direction)
    if (this.lock) {
      return html`${this.view}`
    }
    if (!this.view.children.length) {
      this.addedElementsWithoutAnimation(items, controller)
      return html`${this.view}`
    }
    this.transition(items, controller).catch(console.error)
    return html`${this.view}`
  }

  private async transition(items: Iterable<Value>, controller: AnimationMapController<Value>) {
    const [ keyMap, indexMap ] = this.getKeyMapAndIndexMap(items, controller)
    const viewIndexMap = this.getIndexMapFromView()

    const renderCandidate = this.getAllRenderCandidate(viewIndexMap, indexMap)
    const removeCandidate = this.getAllRemoveCandidate(viewIndexMap, indexMap)
    const moveCandidate = this.getAllMoveCandidate(viewIndexMap, indexMap)

    const renderCandidateElements = this.getAllRenderCandidateElements(renderCandidate, keyMap, controller)
    const removeCandidateElements = this.getAllCandidateElements(removeCandidate)
    const moveCandidateElements = this.getAllCandidateElements(moveCandidate)

    const renderCandidateNodeIndexMap = new Map<number, HTMLElement>()
    const removeCandidateNodeIndexMap = new Map<number, HTMLElement>()
    const moveCandidateNodeIndexMap = new Map<[number, number], HTMLElement>()
    renderCandidateElements.forEach((element, key) => {
      renderCandidateNodeIndexMap.set(indexMap.get(key)!, element)
    })
    removeCandidateElements.forEach((element, key) => {
      removeCandidateNodeIndexMap.set(viewIndexMap.get(key)!, element)
    })
    moveCandidateElements.forEach((element, key) => {
      moveCandidateNodeIndexMap.set([viewIndexMap.get(key)!, indexMap.get(key)!], element)
    })

    const renderCandidateNodeEntries = [ ...renderCandidateElements.entries() ]
    const removeCandidateNodeEntries = [ ...removeCandidateElements.entries() ]
    const moveCandidateNodeEntries = [ ...moveCandidateElements.entries() ]

    await controller.onAnimationStart?.()

    const [
      _,
      renderResultState,
      removeResultState,
      moveResultState
    ] = await Promise.all([
      controller.onBeforeAnimation?.(this.view, renderCandidateNodeIndexMap, removeCandidateNodeIndexMap, moveCandidateNodeIndexMap),
      this.executeHandlerAndReturnResultMap(renderCandidateNodeEntries, (node, key) => controller.onBeforeRenderAnimateItem(node, indexMap.get(key)!)),
      this.executeHandlerAndReturnResultMap(removeCandidateNodeEntries, (node, key) => controller.onBeforeRemoveAnimateItem(node, viewIndexMap.get(key)!)),
      this.executeHandlerAndReturnResultMap(moveCandidateNodeEntries, (node, key) => controller.onBeforeMoveAnimationItem?.(
        node,
        viewIndexMap.get(key)!,
        indexMap.get(key)!
      ) ?? Promise.resolve()),
    ])

    this.renderNode(renderCandidateElements, indexMap)
    this.removeNode(removeCandidateElements)
    this.moveNode(moveCandidateElements, viewIndexMap, indexMap)

    await Promise.all([
      this.executeHandlerAndReturnResultMap(renderCandidateNodeEntries, (node, key) => controller.onAfterRenderAnimateItem?.(node, indexMap.get(key)!, renderResultState.get(key)) ?? Promise.resolve()),
      this.executeHandlerAndReturnResultMap(removeCandidateNodeEntries, (node, key) => controller.onAfterRemoveAnimateItem?.(node, viewIndexMap.get(key)!, removeResultState.get(key)) ?? Promise.resolve()),
      this.executeHandlerAndReturnResultMap(moveCandidateNodeEntries, (node, key) => controller.onAfterMoveAnimationItem?.(
        node,
        moveResultState.get(key)
      ) ?? Promise.resolve()),
      controller.onAfterAnimation?.(this.view, renderCandidateNodeIndexMap, removeCandidateNodeIndexMap, moveCandidateNodeIndexMap),
    ])

    await controller.onAnimationComplete?.()
  }

  private async executeHandlerAndReturnResultMap(nodes: [string, HTMLElement][], handler: (node: HTMLElement, key: string) => Promise<void>): Promise<Map<string, void>> {
    const results = new Map<string, void>()
    await Promise.all(nodes.map(async ([key, node]) => {
      const result = await handler(node, key)
      results.set(key, result)
    }))
    return results
  }

  private getAllRenderCandidate(indexMap: Map<string, number>, newIndexMap: Map<string, number>): Set<string> {
    const candidates = new Set<string>()
    newIndexMap.forEach((_, key) => {
      if (!indexMap.has(key)) {
        candidates.add(key)
      }
    })
    return candidates
  }

  private getAllRemoveCandidate(indexMap: Map<string, number>, newIndexMap: Map<string, number>): Set<string> {
    const candidates = new Set<string>()
    indexMap.forEach((_, key) => {
      if (!newIndexMap.has(key)) {
        candidates.add(key)
      }
    })
    return candidates
  }

  private getAllMoveCandidate(indexMap: Map<string, number>, newIndexMap: Map<string, number>): Set<string> {
    const candidates = new Set<string>()
    const keys = new Set<string>([ ...indexMap.keys(), ...newIndexMap.keys() ])
    keys.forEach(key => {
      const oldIndex = indexMap.get(key)
      const newIndex = newIndexMap.get(key)
      if (oldIndex === undefined || newIndex === undefined) return
      if (oldIndex === newIndex) return
      candidates.add(key)
    })
    return candidates
  }

  private getAllRenderCandidateElements(candidateSet: Set<string>, keyMap: Map<string, Value>, controller: AnimationMapController<Value>): Map<string, HTMLElement> {
    const candidateMap = new Map<string, HTMLElement>()
    let index = 0
    candidateSet.forEach(key => {
      const value = keyMap.get(key)
      if (!value) return
      const element = this.createItem(key)
      const template = controller.onTemplateBuilder(value, index)
      render(template, element)
      candidateMap.set(key, element)
    })
    return candidateMap
  }

  private getAllCandidateElements(candidateSet: Set<string>): Map<string, HTMLElement> {
    const candidateMap = new Map<string, HTMLElement>()
    candidateSet.forEach(key => {
      const element = this.view.querySelector(`#${key}`) as HTMLElement
      if (!element) return
      candidateMap.set(key, element);
    })
    return candidateMap
  }

  private renderNode(candidateElements: Map<string, HTMLElement>, indexMap: Map<string, number>) {
    candidateElements.forEach((node, key) => {
      const index = indexMap.get(key) ?? 0
      const referenceNode = this.view.children[index]
      if (referenceNode) {
        this.view.insertBefore(node, referenceNode)
      } else {
        this.view.appendChild(node)
      }
    })
  }

  private removeNode(nodeMap: Map<string, HTMLElement>) {
    nodeMap.forEach((node) => {
      node.remove()
    })
  }

  private moveNode(candidateElements: Map<string, HTMLElement>, oldIndexMap: Map<string, number>, newIndexMap: Map<string, number>) {
    const viewIndexMap = this.getIndexMapFromView()
    candidateElements.forEach((node, key) => {
      const oldIndex = oldIndexMap.get(key)!
      const newIndex = newIndexMap.get(key)!
      const currentIndex = viewIndexMap.get(key)!
      if (currentIndex === newIndex) {
        return
      }
      let referenceNode
      if (oldIndex > newIndex) {
        referenceNode = this.view.children[newIndex]
      }
      if (oldIndex < newIndex) {
        referenceNode = this.view.children[oldIndex]
      }
      if (!referenceNode) return
      this.view.insertBefore(node, referenceNode);
    })
  }

  private getKeyMapAndIndexMap(items: Iterable<Value>, controller: AnimationMapController<Value>): [ Map<string, Value>, Map<string, number> ] {
    const keyMap = new Map<string, Value>()
    const indexMap = new Map<string, number>()
    let index = 0
    for (const item of items) {
      const key = controller.onKeyExtractor(item, index)
      keyMap.set(key, item)
      indexMap.set(key, index)
      index++
    }
    return [keyMap, indexMap]
  }

  private getIndexMapFromView(): Map<string, number> {
    const indexMap = new Map<string, number>()
    let index = 0
    this.view.childNodes.forEach(node => {
      indexMap.set((node as HTMLElement).id, index++)
    })
    return indexMap
  }

  private addedElementsWithoutAnimation(
    items: Iterable<Value>,
    controller: AnimationMapController<Value>
  ) {
    let index = 0
    for (const item of items) {
      const key = controller.onKeyExtractor(item, index)
      const element = this.createItem(key)
      const template = controller.onTemplateBuilder(item, index)
      render(template, element)
      this.view.appendChild(element)
      index++
    }
  }

  private createItem(
    key: string,
  ) {
    const element = document.createElement('div')
    element.id = key.toString()
    return element
  }

  applyDirection(direction: AnimationMapDirection) {
    let flexDirection
    if (direction === 'vertical') {
      flexDirection = 'column'
    }
    if (direction === 'horizontal') {
      flexDirection = 'row'
    }
    appendStyle(this.view, {
      flexDirection
    })
  }

}

export const animationMap = directive(AnimationMap);
