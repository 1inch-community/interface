import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { sceneContext } from './scene-context.token';
import { SceneContext } from './scene-context';
import { appendStyle } from '@one-inch-community/lit';
import { subscribe, resizeObserver } from '@one-inch-community/lit';
import { animationFrameScheduler, observeOn, of, tap } from 'rxjs';

@customElement(SceneWrapperElement.tagName)
export class SceneWrapperElement extends LitElement {
  static tagName = 'inch-scene-wrapper' as const

  private context =   new ContextProvider(this, { context: sceneContext })

  constructor() {
    super();
    this.context.setValue(new SceneContext())
  }

  override connectedCallback() {
    super.connectedCallback();
    subscribe(this, [
      resizeObserver(this).pipe(
        tap(entry => {
          const parent = this.parentElement
          if (!parent) return
          appendStyle(parent, {
            width: `${entry.contentRect.width + 2}px`,
            height: `${entry.contentRect.height + 2}px`
          })
        })
      ),
      of(null).pipe(
        observeOn(animationFrameScheduler),
        tap(() => {
          const parent = this.parentElement
          if (parent && parent.childNodes.length > 1) {
            const rect = parent.getBoundingClientRect()
            const currentParentHeight = rect.height
            const currentParentWidth = rect.width
            parent.animate([
              { height: `${currentParentHeight}px`, width: `${currentParentWidth}px` },
              { height: `${this.clientHeight}px`, width: `${this.clientWidth}px` }
            ], {
              duration: 200,
              easing: 'cubic-bezier(.2, .8, .2, 1)'
            }).finished.then(() => {
              appendStyle(parent, {
                width: `${this.clientWidth}px`,
                height: `${this.clientHeight}px`
              })
            })
          }
        })
      )
    ])
  }

  animationInStart() {
    const context = this.context.value
    context.animationInStartNext()
  }

  animationInEnd() {
    const context = this.context.value
    context.animationInEndNext()
  }

  animationOutStart() {
    const context = this.context.value
    context.animationOutStartNext()
  }

  animationOutEnd() {
    const context = this.context.value
    context.animationOutEndNext()
  }

  protected override render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'inch-scene-wrapper': SceneWrapperElement
  }
}
