import { directive, Directive, PartInfo } from 'lit/directive.js';
import { html, render, TemplateResult } from 'lit';
import { appendStyle } from '../append-style';

export enum AnimationMapTransitionType {
  render,
  remove,
  move
}

type AnimationMapDirection = 'horizontal' | 'vertical' | 'horizontal-reverted' | 'vertical-reverted'
export interface AnimationMapController<Value, RenderState = void, RemoveState = void, MoveState = void> {
  readonly direction: AnimationMapDirection
  readonly parallelAnimationStrategy?: 'parallel' | 'deleteAfterAdd' | 'addAfterDelete'
  onKeyExtractor(value: Value, index: number): string
  onTemplateBuilder(value: Value, index: number): TemplateResult

  transitionItem(type: AnimationMapTransitionType.render, element: HTMLElement): Promise<void>
  transitionItem(type: AnimationMapTransitionType.remove, element: HTMLElement): Promise<void>
  transitionItem(type: AnimationMapTransitionType.move, element: HTMLElement): Promise<void>

  onBeforeRemoveAnimateItem(element: HTMLElement): Promise<RemoveState>
  onAfterRemoveAnimateItem?(element: HTMLElement, previousStepState: void | RemoveState): Promise<void>

  onBeforeRenderAnimateItem(element: HTMLElement): Promise<RenderState>
  onAfterRenderAnimateItem?(element: HTMLElement, previousStepState: void | RemoveState): Promise<void>

  onBeforeMoveAnimationItem?(element: HTMLElement, oldPosition: number, newPosition: number): Promise<MoveState>
  onAfterMoveAnimationItem?(element: HTMLElement, oldPosition: number, newPosition: number, previousStepState: void | MoveState): Promise<void>

  onBeforeAnimation?(container: HTMLElement, renderElements: HTMLElement[], deleteElements: HTMLElement[]): Promise<void>
  onAfterAnimation?(container: HTMLElement, renderElements: HTMLElement[], deleteElements: HTMLElement[]): Promise<void>

  onAnimationStart?(): Promise<void> | void
  onAnimationComplete?(): Promise<void> | void
}

export class AnimationMap<Value> extends Directive {

  private elementKeySet = new Set<string>()
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

    debugger

    const renderCandidate = this.getAllRenderCandidate(keyMap)
    const removeCandidate = this.getAllRemoveCandidate(keyMap)
    const moveCandidate = this.getAllMoveCandidate(keyMap, indexMap, viewIndexMap)

    await controller.onAnimationStart?.()

    // const [
    //   _,
    //   renderResultState,
    //   removeResultState,
    //   moveResultState
    // ] = await Promise.all([
    //   controller.onBeforeAnimation?.(this.view, renderCandidateNodeList, removeCandidateNodeList),
    //   this.transitionBeforeRenderNode(renderCandidateNodeList, controller),
    //   this.transitionBeforeRemoveNode(removeCandidateNodeList, controller),
    //   this.transitionBeforeMoveNode(moveCandidateNode, controller),
    // ])
    //
    // this.renderNode(renderCandidateNode, indexMap)
    // this.removeNode(removeCandidateNode)
    // this.moveNode(moveCandidateNode)
    //
    // await Promise.all([
    //   controller.onAfterAnimation?.(this.view, renderCandidateNodeList, removeCandidateNodeList),
    //   this.transitionAfterRenderNode(renderCandidateNodeList, renderResultState, controller),
    //   this.transitionAfterRemoveNode(removeCandidateNodeList, removeResultState, controller),
    //   this.transitionAfterMoveNode(moveCandidateNode, moveResultState, controller),
    // ])

    await controller.onAnimationComplete?.()
  }

  private async transitionBeforeRenderNode(nodeList: HTMLElement[], controller: AnimationMapController<Value>) {
    return Promise.all(nodeList.map( node => controller.onBeforeRenderAnimateItem(node)))
  }

  private async transitionBeforeRemoveNode(nodeList: HTMLElement[], controller: AnimationMapController<Value>) {
    return Promise.all(nodeList.map( node => controller.onBeforeRemoveAnimateItem(node)))
  }

  private async transitionBeforeMoveNode(nodeMap: Map<string, [ HTMLElement, number, number ]>, controller: AnimationMapController<Value>) {
    return Promise.all([...nodeMap.values()].map(([ node,  oldIndex, newIndex]) => controller.onBeforeMoveAnimationItem?.(node, oldIndex, newIndex)))
  }

  private async transitionAfterRenderNode(nodeList: HTMLElement[], renderResultState: void[], controller: AnimationMapController<Value>) {
    return Promise.all(nodeList.map((node, index) => controller.onAfterRenderAnimateItem?.(node, renderResultState[index])))
  }

  private async transitionAfterRemoveNode(nodeList: HTMLElement[], removeResultState: void[], controller: AnimationMapController<Value>) {
    return Promise.all(nodeList.map((node, index) => controller.onAfterRemoveAnimateItem?.(node, removeResultState[index])))
  }

  private async transitionAfterMoveNode(nodeMap: Map<string, [ HTMLElement, number, number ]>, moveResultState: void[], controller: AnimationMapController<Value>) {
    return Promise.all([...nodeMap.values()].map(([ node,  oldIndex, newIndex], index) => controller.onAfterMoveAnimationItem?.(node, oldIndex, newIndex, moveResultState[index])))
  }

  private renderNode(nodeMap: Map<string, HTMLElement>, indexMap: Map<string, number>) {
    nodeMap.forEach((node, key) => {
      if (this.elementKeySet.has(key)) return
      const index = indexMap.get(key) ?? 0
      const referenceNode = this.view.children[index]
      if (referenceNode) {
        this.view.insertBefore(node, referenceNode)
      } else {
        this.view.appendChild(node)
      }
      this.elementKeySet.add(key)
    })
  }

  private removeNode(nodeMap: Map<string, HTMLElement>) {
    nodeMap.forEach((node, key) => {
      node.remove()
      this.elementKeySet.delete(key)
    })
  }

  private moveNode(nodeMap: Map<string, [ HTMLElement, number, number ]>) {
    nodeMap.forEach(([ node, oldIndex, newIndex ], key) => {
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

  private getAllRenderCandidate(keyMap: Map<string, Value>): Set<string> {
    const candidates = new Set<string>()
    keyMap.forEach((_, key) => {
      if (!this.elementKeySet.has(key)) {
        candidates.add(key)
      }
    })
    return candidates
  }

  private getAllRemoveCandidate(keyMap: Map<string, Value>) {
    const candidates = new Set<string>()
    this.elementKeySet.forEach(key => {
      if (!keyMap.has(key)) {
        candidates.add(key)
      }
    })
    return candidates
  }

  private getAllMoveCandidate(keyMap: Map<string, Value>, indexMap: Map<string, number>, viewIndexMap: Map<string, number>): Set<string> {
    const candidates = new Set<string>()
    keyMap.forEach((_, key) => {

    })
    return candidates
  }

  private getAllRenderCandidateNode(renderCandidate: Map<string, Value>, controller: AnimationMapController<Value>): Map<string, HTMLElement> {
    const node = new Map<string, HTMLElement>()
    let index = 0
    renderCandidate.forEach((item, key) => {
      const container = this.createItem(key)
      const template = controller.onTemplateBuilder(item, index++)
      render(template, container)
      node.set(key, container);
    })
    return node
  }

  private getAllRemoveCandidateNode(removeCandidate: Set<string>): Map<string, HTMLElement> {
    const node = new Map<string, HTMLElement>()
    removeCandidate.forEach((key) => {
      const container = this.view.querySelector(`#${key}`) as HTMLElement
      if (!container) return
      node.set(key, container);
    })
    return node
  }

  private getAllMoveCandidateNode(moveCandidate: Map<string, [number, number]>): Map<string, [ HTMLElement, number, number ]> {
    const node = new Map<string, [ HTMLElement, number, number ]>()
    moveCandidate.forEach(([ oldIndex, newIndex ], key) => {
      const container = this.view.querySelector(`#${key}`) as HTMLElement
      node.set(key, [ container, oldIndex, newIndex ]);
    })
    return node
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
      this.elementKeySet.add(key)
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
    if (direction === 'horizontal-reverted') {
      flexDirection = 'row-reverse'
    }
    if (direction === 'vertical-reverted') {
      flexDirection = 'column-reverse'
    }
    appendStyle(this.view, {
      flexDirection
    })
  }

}

export const animationMap = directive(AnimationMap);
