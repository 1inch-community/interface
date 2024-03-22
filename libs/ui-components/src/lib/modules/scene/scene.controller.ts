import { html, render, TemplateResult } from 'lit';
import { sceneStyle } from './scene.style';

type RenderConfig = Record<string, () => TemplateResult>

export class SceneController {

  static styles = sceneStyle

  private currentScenes?: RenderConfig

  private readonly sceneStack: string[] = []

  private readonly sceneContainer = buildSceneContainer()

  constructor(private readonly rootSceneName: string) {}

  render(config: RenderConfig): TemplateResult {
    this.currentScenes = config
    const sceneName = this.getCurrentSceneName()
    const sceneFactory = this.getScene(sceneName)
    if (!sceneFactory) {
      throw new Error(`Scene not exist`);
    }
    const sceneWrapper = this.buildSceneWrapper(sceneFactory(), sceneName)
    this.clearContainer()
    this.sceneContainer.appendChild(sceneWrapper)
    return html`${this.sceneContainer}`
  }

  async nextTo(sceneName: string) {
    await this.transition(sceneName)
    this.sceneStack.push(sceneName)
  }

  async back() {
    const sceneName = this.sceneStack[this.sceneStack.length - 2] ?? this.rootSceneName
    await this.transition(sceneName, true)
    this.sceneStack.pop()
  }

  private async transition(sceneName: string, isBack?: boolean) {
    const currentScene = this.getCurrentSceneName()
    if (currentScene === sceneName) return
    const nextSceneFactory = this.getScene(sceneName)
    if (!nextSceneFactory) throw new Error(`Scene ${sceneName} not exist`);
    const sceneWrapper = this.buildSceneWrapper(nextSceneFactory(), sceneName)
    sceneWrapper.classList.add('scene-wrapper-hidden')
    this.sceneContainer.appendChild(sceneWrapper)
    this.sceneContainer.style.height = `${sceneWrapper.offsetHeight}px`
    this.sceneContainer.style.width = `${sceneWrapper.offsetWidth}px`
    const animationClass = isBack ? 'scene-wrapper-animate-back' : 'scene-wrapper-animate'
    sceneWrapper.classList.add(animationClass)
    await waitAnimationEnd(sceneWrapper)
    sceneWrapper.classList.remove('scene-wrapper-hidden', animationClass)
    this.sceneContainer.firstChild && this.sceneContainer.removeChild(this.sceneContainer.firstChild)
  }

  private getCurrentScene() {
    if (!this.currentScenes) return null
    const currentScene = this.getCurrentSceneName()
    return this.getScene(currentScene)
  }

  private getCurrentSceneName(): string {
    let currentScene: string = this.rootSceneName
    if (this.sceneStack.length > 0) {
      currentScene = this.sceneStack[this.sceneStack.length - 1]
    }
    return currentScene
  }

  private getScene(sceneName: string) {
    if (!this.currentScenes) return null
    return this.currentScenes[sceneName] ?? null
  }

  private clearContainer() {
    while (this.sceneContainer.firstChild) {
      this.sceneContainer.removeChild(this.sceneContainer.firstChild);
    }
  }

  private buildSceneWrapper(content: TemplateResult, name: string) {
    const sceneWrapper = document.createElement('div');
    sceneWrapper.id = 'scene-wrapper';
    sceneWrapper.classList.add('scene-wrapper', name);
    render(content, sceneWrapper)
    return sceneWrapper;
  }
}

function buildSceneContainer() {
  const sceneContainer = document.createElement('div')
  sceneContainer.id = 'scene-container'
  sceneContainer.classList.add('scene-container')
  return sceneContainer
}

function waitAnimationEnd(target: HTMLElement) {
  return new Promise(resolve => {
    target.addEventListener('animationend', resolve, { once: true, passive: true })
  })
}