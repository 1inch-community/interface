import { directive, Directive, PartInfo } from 'lit/directive.js';
import { html, render, TemplateResult } from 'lit';

type AnimationConfig = {
  deleteElement: (element: HTMLElement) => Promise<void>
  addedElement: (element: HTMLElement) => Promise<(element: HTMLElement) => Promise<void>>
}

export class AnimationMap extends Directive {

  private elementKeySet = new Set<number | string>()
  private readonly view = document.createElement('div')
  private lock = false

  constructor(partInfo: PartInfo) {
    super(partInfo);
    this.view.style.display = 'flex'
    this.view.style.gap = '8px'
  }

  override render(
    items: Iterable<any>,
    keyExtractor: (value: any, index: number) => string | number,
    config: AnimationConfig,
    templateBuilder: (value: any) => TemplateResult,
  ): TemplateResult {
    if (this.lock) {
      return html`${this.view}`
    }
    if (!this.view.children.length) {
      this.addedElementsWithoutAnimation(items, keyExtractor, templateBuilder)
      return html`${this.view}`
    }
    const newElementKeySet = new Set<number | string>()
    const itemsMap = new Map<number | string, any>()
    const indexMap = new Map<number | string, number>()
    let index = 0
    for (const item of items) {
      const key = keyExtractor(item, index)
      newElementKeySet.add(key)
      itemsMap.set(key, item);
      indexMap.set(key, index)
      index++
    }

    const deleteCandidates = new Set<number | string>()
    const addedCandidates = new Set<number | string>()

    this.elementKeySet.forEach(key => {
      if (!newElementKeySet.has(key)) {
        deleteCandidates.add(key)
      }
    })

    newElementKeySet.forEach(key => {
      if (!this.elementKeySet.has(key)) {
        addedCandidates.add(key)
      }
    })

    this.lock = true
    Promise.all([
      this.deleteElements(deleteCandidates, config.deleteElement),
      this.addedElements(addedCandidates, itemsMap, indexMap, config.addedElement, templateBuilder)
    ]).then(() => {
      this.elementKeySet = newElementKeySet
      this.lock = false
    })

    return html`${this.view}`
  }

  private async deleteElements(candidates: Set<number | string>, config: AnimationConfig['deleteElement']) {
    const pending: Promise<unknown>[] = []

    const iter = async (key: string | number) => {
      const element = this.view.querySelector(`#${key}`) as HTMLElement
      if (!element) return
      await config(element);
      element.remove();
    }

    for (const key of candidates) {
      pending.push(iter(key));
    }

    await Promise.all(pending);
  }

  private async addedElements(
    candidates: Set<number | string>,
    itemsMap: Map<number | string, any>,
    indexMap: Map<number | string, number>,
    config: AnimationConfig['addedElement'],
    templateBuilder: (value: any) => TemplateResult,
  ) {
    const pending: Promise<unknown>[] = []
    const iter = async (key: string | number) => {
      const item = itemsMap.get(key)
      const element = document.createElement('div')
      element.id = key.toString()
      const template = templateBuilder(item)
      render(template, element)
      const renderReady = await config(element)
      const targetElement = this.view.children[(indexMap.get(key) ?? 0)]
      if (targetElement) {
        this.view.insertBefore(element, targetElement)
      } else {
        this.view.appendChild(element)
      }
      await renderReady(element);
    }

    for (const key of candidates) {
      pending.push(iter(key));
    }

    await Promise.all(pending)
  }

  private addedElementsWithoutAnimation(
    items: Iterable<any>,
    keyExtractor: (value: any, index: number) => string | number,
    templateBuilder: (value: any) => TemplateResult,
  ) {
    let index = 0
    for (const item of items) {
      const key = keyExtractor(item, index)
      const element = document.createElement('div')
      element.id = key.toString()
      const template = templateBuilder(item)
      render(template, element)
      this.view.appendChild(element)
      this.elementKeySet.add(key)
      index++
    }
  }


}

export const animationMap = directive(AnimationMap);
