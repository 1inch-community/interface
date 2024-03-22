import { html, css, LitElement, render } from 'lit';
import { describe, it, beforeEach, expect } from 'vitest';
import { EventEmitter } from '../event-emitter';
import { EventEmitterViewBinder } from './event-emitter-view-binder';

class TestComponent extends LitElement {
  eventEmitter: EventEmitter<number> = new EventEmitter(1);

  static override styles = css`
      :host {
          display: block;
      }
  `;

  bind = new EventEmitterViewBinder(this, this.eventEmitter);

  override render() {
    return html`
      <button id="test-button" @click=${() => this.eventEmitter.emit((this.eventEmitter.getValue() ?? 0) + 1)}>Click me ${this.bind.value}</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-component': TestComponent
  }
}

customElements.define('test-component', TestComponent);

describe('EventEmitterViewBinder', () => {
  let testComponent: TestComponent;

  beforeEach(() => {
    testComponent = document.createElement('test-component')
    render(testComponent, document.body)
  });

  it('initial value is null', () => {
    expect(testComponent.eventEmitter.getValue()).toBe(1);
  });

  it('press to test button', async () => {
    const testButton: HTMLButtonElement = testComponent.renderRoot.querySelector('button') as HTMLButtonElement
    expect(testButton).not.toBeNull()
    expect(testButton.textContent).toBe('Click me 1')
    testButton.dispatchEvent(new Event('click'))
    await testComponent.updateComplete
    expect(testButton.textContent).toContain('Click me 2')
  })
});