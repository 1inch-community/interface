import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import {EventMap, Provider} from "../models";

/**
 * Fork native rxjs fromEvent observer
 * compliant with EIP 1193
 * https://eips.ethereum.org/EIPS/eip-1193
 *
 * NgZone is required in order to handle Change Detection
 * correctly after receiving a message from the wallet browser extension.
 * */
export function fromEIP1193Event<Event extends keyof EventMap>(
    target: Provider,
    eventName: Event,
    zone: NgZone
): Observable<EventMap[Event]> {
    return new Observable<EventMap[Event]>((subscriber) => {
        const handler = (event: any) => {
            zone.run(() => subscriber.next(event));
        };
        (target as any).on(eventName, handler);
        return () => {
            if ('removeListener' in target) {
                return (target as any).removeListener(eventName, handler);
            }
            console.warn('unable to unsubscribe from provider', target, eventName);
        };
    });
}
