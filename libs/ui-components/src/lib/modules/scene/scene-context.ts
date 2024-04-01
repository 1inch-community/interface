import { firstValueFrom, Subject } from 'rxjs';

export interface ISceneContext {
  readonly animationInStart: Promise<void>
  readonly animationInEnd: Promise<void>
  readonly animationOutStart: Promise<void>
  readonly animationOutEnd: Promise<void>
}

export class SceneContext implements ISceneContext {

  animationInStart$ = new Subject<void>()
  animationInEnd$ = new Subject<void>()
  animationOutStart$ = new Subject<void>()
  animationOutEnd$ = new Subject<void>()

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

}