import { html, render, TemplateResult } from 'lit';
import { sceneStyle } from './scene.style';
import { SceneWrapperElement } from './scene-wrapper.element';
import { Animation } from './animations/animation';
import { slideAnimation } from './animations/slide.animation';
import { appendStyle } from '@one-inch-community/lit';
import { asyncFrame } from '../async/async-frame';

type RenderConfig<T extends string> = Record<T, () => TemplateResult>

type SceneConfig<T extends string> = Record<T, SceneConfigItem>

interface SceneConfigItem {
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  lazyRender?: boolean;
}

export class SceneController<T extends string, U extends T> {

  static styles = sceneStyle;

  private currentScenes?: RenderConfig<T>;

  private sceneStack: string[] = [];

  private readonly sceneContainer = buildSceneContainer();

  private transitionInProgress = false;

  constructor(private readonly rootSceneName: U,
              private readonly config: SceneConfig<T>,
              private readonly animation: Animation = slideAnimation()) {
  }

  render(config: RenderConfig<T>): TemplateResult {
    if (this.transitionInProgress) {
      return html`${this.sceneContainer}`;
    }
    const isFirstRender = !this.currentScenes;
    this.currentScenes = config;
    const sceneName = this.getCurrentSceneName();
    const currentSceneConfig = this.config[sceneName];
    const isLazyRenderScene = currentSceneConfig.lazyRender ?? false;
    if (!isLazyRenderScene || isFirstRender) {
      const sceneFactory = this.getScene(sceneName);
      if (!sceneFactory) {
        throw new Error(`Scene not exist`);
      }
      const sceneWrapper = this.buildSceneWrapper(sceneFactory(), sceneName);
      this.clearContainer();
      this.sceneContainerAppendChild(sceneName, sceneWrapper);
    }
    return html`${this.sceneContainer}`;
  }

  async nextTo(sceneName: T) {
    if (this.transitionInProgress) return;
    await this.transition(sceneName);
    this.sceneStack.push(sceneName);
  }

  async back() {
    if (this.transitionInProgress) return;
    const sceneName = (this.sceneStack[this.sceneStack.length - 2] ?? this.rootSceneName) as T;
    await this.transition(sceneName, true);
    this.sceneStack.pop();
  }

  resetScene() {
    this.sceneStack = [];
  }

  getCurrentSceneName(): T {
    let currentScene: T = this.rootSceneName;
    if (this.sceneContainer.firstChild) {
      currentScene = (this.sceneContainer.firstChild as HTMLElement).id as T;
    }
    return currentScene;
  }

  private getCurrentScene() {
    if (!this.currentScenes) return null;
    const currentScene = this.getCurrentSceneName();
    return this.getScene(currentScene);
  }

  private async transition(sceneName: T, isBack?: boolean) {
    this.transitionInProgress = true;
    try {
      const currentScene = this.getCurrentSceneName();
      if (currentScene === sceneName) return;
      const nextSceneFactory = this.getScene(sceneName);
      if (!nextSceneFactory) throw new Error(`Scene ${sceneName} not exist`);
      const nextSceneWrapper = this.buildSceneWrapper(nextSceneFactory(), sceneName);
      const currentSceneWrapper = this.sceneContainer.firstChild as SceneWrapperElement;

      const upScene = isBack ? currentSceneWrapper : nextSceneWrapper;
      const downScene = !isBack ? currentSceneWrapper : nextSceneWrapper;

      isBack ? upScene.animationOutStart() : upScene.animationInStart();
      isBack ? downScene.animationOutStart() : downScene.animationInStart();

      this.sceneContainerAppendChild(sceneName, nextSceneWrapper);
      await asyncFrame()
      const nextSceneWrapperRect = nextSceneWrapper.getBoundingClientRect();
      const currentSceneWrapperRect = currentSceneWrapper.getBoundingClientRect();
      await this.animation.preparation(upScene, downScene, isBack ?? false);
      await Promise.all([
        this.animation.transition(upScene, downScene, isBack ?? false),
        this.resizeContainer(nextSceneWrapperRect, currentSceneWrapperRect)
      ]);

      this.sceneContainer.firstChild && this.sceneContainer.removeChild(this.sceneContainer.firstChild);

      isBack ? upScene.animationOutEnd() : upScene.animationInEnd();
      isBack ? downScene.animationOutEnd() : downScene.animationInEnd();

    } finally {
      this.transitionInProgress = false;
    }
  }

  private getScene(sceneName: T) {
    if (!this.currentScenes) return null;
    return this.currentScenes[sceneName] ?? null;
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
    render(content, sceneWrapper);
    return sceneWrapper;
  }

  private sceneContainerAppendChild(sceneName: T, sceneWrapper: HTMLElement) {
    this.sceneContainer.appendChild(sceneWrapper);
    const config = this.config[sceneName];
    this.applySceneConfig(config);
  }

  private applySceneConfig(config: SceneConfigItem) {
    const formatValue = (value?: number | string) => {
      if (!value) return '';
      return (typeof value === 'number') ? `${value}px` : value;
    };
    appendStyle(this.sceneContainer, {
      minHeight: formatValue(config.minHeight),
      maxHeight: formatValue(config.maxHeight),
      minWidth: formatValue(config.minWidth),
      maxWidth: formatValue(config.maxWidth)
    });
  }

  private async resizeContainer(nextRect: DOMRect, currentRect: DOMRect) {
    await this.sceneContainer.animate([
      { height: `${currentRect.height}px`, width: `${currentRect.width}px` },
      { height: `${nextRect.height}px`, width: `${nextRect.width}px` }
    ], {
      duration: 200,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }).finished;

    appendStyle(this.sceneContainer, {
      width: `${nextRect.width}px`,
      height: `${nextRect.height}px`
    });
  }
}

function buildSceneContainer() {
  const sceneContainer: HTMLDivElement = document.createElement('div');
  sceneContainer.id = 'scene-container';
  sceneContainer.classList.add('scene-container');
  return sceneContainer;
}
