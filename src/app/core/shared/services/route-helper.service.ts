import {Injectable} from '@angular/core';
import {filter, map, Observable, scan, shareReplay} from 'rxjs';
import {ActivationEnd, EventType, Router} from '@angular/router';
import {Initialized, initializedProvider} from "@1inch/v3/core/shared";
import {ChainId} from "@1inch/v3/core/wallet";

interface PathParams {
    chainId?: ChainId
    swapMode?: 'fusion'
    srcToken?: string
    dstToken?: string
}

@Injectable()
export class RouteHelperService implements Initialized {

    private params: Record<string, string> = {}
    private data: Record<string, string> = {}

    private readonly events$ = this.router.events.pipe(
        shareReplay({ bufferSize: 5, refCount: true })
    )

    readonly params$: Observable<Record<string, string>> = this.events$.pipe(
        filter<any>(event => event.type === EventType.ActivationEnd),
        filter((event: ActivationEnd) => !event.snapshot.children.length),
        map((event: ActivationEnd) => event.snapshot.params ?? {}),
        map(params => ({...params})),
        scan((acc, params) => {
            const keys = Object.keys(params)
            for (const key of keys) {
                acc[key] = params[key]
            }
            this.params = { ...acc }
            return this.params
        }, {} as Record<string, string>),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    readonly data$: Observable<Record<string, string>> = this.events$.pipe(
        filter<any>(event => event.type === EventType.ActivationEnd),
        filter((event: ActivationEnd) => !event.snapshot.children.length),
        map((event: ActivationEnd) => event.snapshot.data ?? {}),
        map(data => ({...data})),
        scan((acc, data) => {
            const keys = Object.keys(data)
            for (const key of keys) {
                acc[key] = data[key]
            }
            this.data = { ...acc }
            return this.data
        }, {} as Record<string, string>),
        shareReplay({ bufferSize: 1, refCount: true })
    );


    constructor(private readonly router: Router) {
    }

    initialize(): Promise<void> | void {
        this.events$.subscribe()
        this.params$.subscribe()
        this.data$.subscribe()
    }

    getParams(): Record<string, string> {
        return { ...this.params }
    }

    async updatePathAndRedirect(pathParams: PathParams) {
        const newParams = { ...this.params, ...pathParams }
        const { swapModePath } = this.data
        await this.router.navigate([
            newParams.chainId,
            swapModePath,
            newParams.srcToken,
            newParams.dstToken,
        ].filter(Boolean))
    }

    updatePathAndBuildUrlTree(pathParams: PathParams) {
        const newParams = { ...this.params, ...pathParams }
        const { swapModePath } = this.data
        return this.router.parseUrl([
            newParams.chainId,
            swapModePath,
            newParams.srcToken,
            newParams.dstToken,
        ].filter(Boolean).join('/'))
    }

    async openSelectToken(type: 'srcToken' | 'dstToken') {
        const { chainId, srcToken, dstToken } = this.params
        const { swapModePath } = this.data
        await this.router.navigate([
            chainId,
            swapModePath,
            srcToken,
            dstToken,
            'select',
            type
        ].filter(Boolean))
    }
}

export function provideRouteHelperService() {
    return initializedProvider([RouteHelperService])
}
