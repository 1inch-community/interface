import { html, render, TemplateResult } from 'lit';
import { sceneStyle } from './scene.style';
import { SceneWrapperElement } from './scene-wrapper.element'

type RenderConfig<T extends string> = Record<T, () => TemplateResult>

type SceneConfig<T extends string> = Record<T, SceneConfigItem>

interface SceneConfigItem {
  width?: number | string
  height?: number | string
}

export class SceneController<T extends string, U extends T> {

  static styles = sceneStyle

  private currentScenes?: RenderConfig<T>

  private sceneStack: string[] = []

  private readonly sceneContainer = buildSceneContainer()

  private transitionInProgress = false

  constructor(private readonly rootSceneName: U,
              private readonly config: SceneConfig<T>) {}

  render(config: RenderConfig<T>): TemplateResult {
    this.currentScenes = config
    const sceneName = this.getCurrentSceneName()
    const sceneFactory = this.getScene(sceneName)
    if (!sceneFactory) {
      throw new Error(`Scene not exist`);
    }
    const sceneWrapper = this.buildSceneWrapper(sceneFactory(), sceneName)
    this.clearContainer()
    this.sceneContainerAppendChild(sceneName, sceneWrapper).then()
    return html`${this.sceneContainer}`
  }

  async nextTo(sceneName: T) {
    if (this.transitionInProgress) return
    await this.transition(sceneName)
    this.sceneStack.push(sceneName)
  }

  async back() {
    if (this.transitionInProgress) return
    const sceneName = (this.sceneStack[this.sceneStack.length - 2] ?? this.rootSceneName) as T
    await this.transition(sceneName, true)
    this.sceneStack.pop()
  }

  resetScene() {
    this.sceneStack = []
  }

  private async transition(sceneName: T, isBack?: boolean) {
    this.transitionInProgress = true
    try {
      const currentScene = this.getCurrentSceneName()
      if (currentScene === sceneName) return
      const nextSceneFactory = this.getScene(sceneName)
      if (!nextSceneFactory) throw new Error(`Scene ${sceneName} not exist`);
      const nextSceneWrapper = this.buildSceneWrapper(nextSceneFactory(), sceneName)
      const currentSceneWrapper = this.sceneContainer.firstChild as SceneWrapperElement

      const upScene = isBack ? currentSceneWrapper : nextSceneWrapper
      const downScene = !isBack ? currentSceneWrapper : nextSceneWrapper

      const upSceneStart = isBack ? 'scene-up-out-start' : 'scene-up-in-start'
      const upSceneVector = isBack ? 'scene-up-out' : 'scene-up-in'
      const downSceneStart = isBack ? 'scene-down-out-start' : 'scene-down-in-start'
      const downSceneVector = isBack ? 'scene-down-out' : 'scene-down-in'

      isBack ? upScene.animationOutStart() : upScene.animationInStart()
      isBack ? downScene.animationOutStart() : downScene.animationInStart()

      this.sceneContainer.classList.add('scene-container-animation')
      upScene.classList.add('scene-up', upSceneStart)
      downScene.classList.add('scene-down', downSceneStart)

      await this.sceneContainerAppendChild(sceneName, nextSceneWrapper)

      upScene.classList.add(upSceneVector)
      downScene.classList.add(downSceneVector)

      await waitAnimationEnd(upScene)

      this.sceneContainer.classList.remove('scene-container-animation')
      nextSceneWrapper.classList.remove(
        'scene-up',
        'scene-up-in-start',
        'scene-up-out-start',
        'scene-up-out',
        'scene-up-in',
        'scene-down',
        'scene-down-in-start',
        'scene-down-out-start',
        'scene-down-out',
        'scene-down-in'
      )
      this.sceneContainer.removeChild(currentSceneWrapper)

      isBack ? upScene.animationOutEnd() : upScene.animationInEnd()
      isBack ? downScene.animationOutEnd() : downScene.animationInEnd()
    } finally {
      this.transitionInProgress = false
    }
  }

  private getCurrentScene() {
    if (!this.currentScenes) return null
    const currentScene = this.getCurrentSceneName()
    return this.getScene(currentScene)
  }

  private getCurrentSceneName(): T {
    let currentScene: T = this.rootSceneName
    if (this.sceneContainer.firstChild) {
      currentScene = (this.sceneContainer.firstChild as HTMLElement).id as T
    }
    return currentScene
  }

  private getScene(sceneName: T) {
    if (!this.currentScenes) return null
    return this.currentScenes[sceneName] ?? null
  }

  private clearContainer() {
    while (this.sceneContainer.firstChild) {
      this.sceneContainer.removeChild(this.sceneContainer.firstChild);
    }
  }

  private buildSceneWrapper(content: TemplateResult, name: string): SceneWrapperElement {
    const sceneWrapper = document.createElement(SceneWrapperElement.tagName) as SceneWrapperElement;
    sceneWrapper.id = name;
    sceneWrapper.classList.add('scene-wrapper', name);
    render(content, sceneWrapper)
    return sceneWrapper;
  }

  private async sceneContainerAppendChild(sceneName: T, sceneWrapper: HTMLElement) {
    this.sceneContainer.appendChild(sceneWrapper)
    const config = this.config[sceneName]
    if (config.width) {
      this.sceneContainer.style.width = (typeof config.width === 'number') ? `${config.width}px` : config.width
    }
    if (config.height) {
      this.sceneContainer.style.height = (typeof config.height === 'number') ? `${config.height}px` : config.height
    }
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
