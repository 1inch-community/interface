import { firstValueFrom, Subject } from 'rxjs';

export interface ISceneContext {
  readonly animationInProgress: boolean
  readonly animationInStart: Promise<void>
  readonly animationInEnd: Promise<void>
  readonly animationOutStart: Promise<void>
  readonly animationOutEnd: Promise<void>
}

export class SceneContext implements ISceneContext {

  animationInProgress = false

  private animationInStart$ = new Subject<void>()
  private animationInEnd$ = new Subject<void>()
  private animationOutStart$ = new Subject<void>()
  private animationOutEnd$ = new Subject<void>()

  get animationInStart() {
    return firstValueFrom(this.animationInStart$)
  }

  get animationInEnd() {
    return firstValueFrom(this.animationInEnd$)
  }

  get animationOutStart() {
    return firstValueFrom(this.animationOutStart$)
  }

  get animationOutEnd() {
    return firstValueFrom(this.animationOutEnd$)
  }

  animationInStartNext() {
    this.animationInProgress = true
    this.animationInStart$.next();
  }

  animationInEndNext() {
    this.animationInProgress = false
    this.animationInEnd$.next();
  }

  animationOutStartNext() {
    this.animationInProgress = true
    this.animationOutStart$.next();
  }

  animationOutEndNext() {
    this.animationInProgress = false
    this.animationOutEnd$.next();
  }

}