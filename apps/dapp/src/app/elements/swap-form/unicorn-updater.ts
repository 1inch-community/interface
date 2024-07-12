import { appendStyle, vibrate } from '@one-inch-community/core/lit';
import {
  animationFrameScheduler,
  defer,
  filter,
  firstValueFrom,
  fromEvent,
  map,
  subscribeOn,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { CacheActivePromise } from '@one-inch-community/core/decorators';
import { Ref } from 'lit/directives/ref.js'

export function unicornTouchUpdate(swapFormContainerRef: Ref<HTMLElement>, unicornLoaderRef: Ref<HTMLElement>) {
  let lastPosition = 0;
  let full = false;
  let resetInProgress = false;
  const audio = new AudionController();
  const max = 60;
  const initialResistance = 500000;
  const resistanceThreshold = 3;
  const resistance = 4;
  const root = (): HTMLElement | null => document.querySelector('#app-root');
  const target = (): HTMLElement => swapFormContainerRef.value!;
  const loader = (): HTMLElement => unicornLoaderRef.value!;
  const set = (position: number) => {
    if (position < 0) return;
    let adjustedPosition: number;

    if (position > max) {
      if (!full) {
        vibrate(50);
        audio.play().then();
      }
      full = true;
      if (position <= max + resistanceThreshold) {
        adjustedPosition = max + (position - max) / initialResistance;
      } else {
        adjustedPosition = max + (resistanceThreshold / initialResistance) + ((position - max - resistanceThreshold) / resistance);
      }
    } else {
      full = false;
      adjustedPosition = position;
    }
    const loaderPosition = (position > max ? max : position) / max;
    appendStyle(loader(), { transform: `scale(${loaderPosition})` });
    appendStyle(target(), { transform: `translate3d(0, ${adjustedPosition}px, 0)` });
    lastPosition = adjustedPosition;
  };
  const reset = async () => {
    resetInProgress = true;
    let _lastPosition = lastPosition;
    if (_lastPosition > max && audio.isPlaying) {
      await target().animate([
        { transform: `translate3d(0, ${_lastPosition}px, 0)` },
        { transform: `translate3d(0, ${max}px, 0)` }
      ], {
        duration: 200,
        easing: 'cubic-bezier(.2, .8, .2, 1)'
      }).finished;
      _lastPosition = max;
      appendStyle(target(), { transform: `translate3d(0, ${_lastPosition}px, 0)` });
      await audio.onEnded();
    }
    await target().animate([
      { transform: `translate3d(0, ${_lastPosition}px, 0)` },
      { transform: `translate3d(0, 0, 0)` }
    ], {
      duration: 800,
      easing: 'cubic-bezier(.2, .8, .2, 1)'
    }).finished;
    set(0);
    appendStyle(target(), { transform: '' });
    full = false;
    resetInProgress = false;
  };
  return defer(() => {
    const targetEl = target();
    return fromEvent<TouchEvent>(targetEl, 'touchstart').pipe(
      filter(() => {
        return !resetInProgress && (root()?.scrollTop ?? 0) === 0;
      }),
      switchMap((startEvent: TouchEvent) => {
        audio.load();
        const startPoint = startEvent.touches[0].clientY;
        return fromEvent<TouchEvent>(targetEl, 'touchmove').pipe(
          map(event => event.touches[0].clientY - startPoint),
          tap(position => set(position)),
          takeUntil(fromEvent<TouchEvent>(targetEl, 'touchend').pipe(
            tap(() => reset())
          ))
        );
      })
    );
  }).pipe(subscribeOn(animationFrameScheduler));
}

class AudionController {

  get isPlaying(): boolean {
    return !this.audio.paused;
  }

  private readonly audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio('audio/unicorn-run.mp3');
    this.audio.preload = 'none';
    this.audio.volume = 0.4;
  }

  load() {
    this.audio.load();
  }

  @CacheActivePromise()
  async play() {
    try {
      await this.audio.play();
    } catch (e) {
      console.error('AudionController Error', e);
    }
  }

  onEnded() {
    return firstValueFrom(fromEvent(this.audio, 'ended'));
  }

}
