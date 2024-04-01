import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ContextProvider } from '@lit/context';
import { sceneContext } from './scene-context.token';
import { SceneContext } from './scene-context';

@customElement(SceneWrapperElement.tagName)
export class SceneWrapperElement extends LitElement {
  static tagName = 'inch-scene-wrapper'

  private context =   new ContextProvider(this, { context: sceneContext })

  constructor() {
    super();
    this.context.setValue(new SceneContext())
  }

  animationInStart() {
    const context = this.context.value
    context.animationInStart$.next()
  }

  animationInEnd() {
    const context = this.context.value
    context.animationInEnd$.next()
  }

  animationOutStart() {
    const context = this.context.value
    context.animationOutStart$.next()
  }

  animationOutEnd() {
    const context = this.context.value
    context.animationOutEnd$.next()
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