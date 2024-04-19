import { html, render, TemplateResult } from 'lit';
import { sceneStyle } from './scene.style';
import { SceneWrapperElement } from './scene-wrapper.element'
import { AnimationType } from './animations/animation-type';
import { slideAnimation } from './animations/slide.animation';

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
              private readonly config: SceneConfig<T>,
              private readonly animation: AnimationType = slideAnimation()) {}

  render(config: RenderConfig<T>): TemplateResult {
    this.currentScenes = config
    const sceneName = this.getCurrentSceneName()
    const sceneFactory = this.getScene(sceneName)
    if (!sceneFactory) {
      throw new Error(`Scene not exist`);
    }
    const sceneWrapper = this.buildSceneWrapper(sceneFactory(), sceneName)
    this.clearContainer()
    this.sceneContainerAppendChild(sceneName, sceneWrapper)
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

  updateSceneConfig(config: SceneConfigItem) {
    const currentScene = this.getCurrentSceneName()
    this.config[currentScene] = config
    this.applySceneConfig(config)
  }

  getCurrentSceneName(): T {
    let currentScene: T = this.rootSceneName
    if (this.sceneContainer.firstChild) {
      currentScene = (this.sceneContainer.firstChild as HTMLElement).id as T
    }
    return currentScene
  }

  private getCurrentScene() {
    if (!this.currentScenes) return null
    const currentScene = this.getCurrentSceneName()
    return this.getScene(currentScene)
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

      isBack ? upScene.animationOutStart() : upScene.animationInStart()
      isBack ? downScene.animationOutStart() : downScene.animationInStart()

      this.sceneContainer.classList.add('scene-container-animation')

      await this.animation.beforeAppend(upScene, downScene, isBack ?? false)
      this.sceneContainerAppendChild(sceneName, nextSceneWrapper)
      await this.animation.afterAppend(upScene, downScene, isBack ?? false)

      this.sceneContainer.classList.remove('scene-container-animation')

      this.sceneContainer.firstChild && this.sceneContainer.removeChild(this.sceneContainer.firstChild)

      isBack ? upScene.animationOutEnd() : upScene.animationInEnd()
      isBack ? downScene.animationOutEnd() : downScene.animationInEnd()
    } finally {
      this.transitionInProgress = false
    }
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

  private sceneContainerAppendChild(sceneName: T, sceneWrapper: HTMLElement) {
    this.sceneContainer.appendChild(sceneWrapper)
    const config = this.config[sceneName]
    this.applySceneConfig(config)
  }

  private applySceneConfig(config: SceneConfigItem) {
    this.sceneContainer.style.width = ''
    this.sceneContainer.style.height = ''
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
