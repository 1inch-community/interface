import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { sceneContext } from './scene-context.token';
import { SceneContext } from './scene-context';

@customElement(SceneWrapperElement.tagName)
export class SceneWrapperElement extends LitElement {
  static tagName = 'inch-scene-wrapper' as const

  static override styles = css`
      :host {
          background-color: var(--scene-background-color);
          will-change: transform;
          transform: translate3d(0, 0, 0);
          padding: 1px;
          height: fit-content;
          box-sizing: border-box;
          position: relative;
          display: block;
      }
  `

  private context =   new ContextProvider(this, { context: sceneContext })

  constructor() {
    super();
    this.context.setValue(new SceneContext())
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
