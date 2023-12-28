import { Injectable } from '@angular/core';
import { fromEvent, map, shareReplay, startWith, tap } from 'rxjs';

const navigator: any = window.navigator;
const userAgent = navigator.userAgent;
const normalizedUserAgent = userAgent.toLowerCase();
const standalone = navigator.standalone;

const isIos = /ip(ad|hone|od)/.test(normalizedUserAgent)
    || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
const isAndroid = /android/.test(normalizedUserAgent);
const isSafari = /safari/.test(normalizedUserAgent);
const isWebview = (isAndroid && /; wv\)/.test(normalizedUserAgent)) || (isIos && !standalone && !isSafari);

@Injectable({
    providedIn: 'root',
})
export class PlatformService {

    private isMobileViewState = false;

    readonly isMobileView$ = fromEvent(window, 'resize').pipe(
        startWith(null),
        map(() => window.innerWidth <= 832),
        tap(state => this.isMobileViewState = state),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    get isMobileView() {
        return this.isMobileViewState;
    }

    get isWebView() {
        return isWebview;
    }

    get isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    constructor() {
        this.isMobileView$.subscribe();
    }
}
