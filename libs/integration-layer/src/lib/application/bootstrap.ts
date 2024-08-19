import { bootstrapApplicationContext } from './context';
import { html, render } from 'lit';
import './global-application-context.element'

export async function bootstrapApplication(entryPointFactory: () => Promise<unknown>): Promise<void> {
  await Promise.all([
    entryPointFactory(),
    bootstrapApplicationContext(),
  ])

  const template = html`
    <global-application-context>
      <app-root id="app-root"></app-root>
      <div id="overlay-container"></div>
    </global-application-context>
  `
  render(template, document.body)
}
