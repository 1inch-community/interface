import { EIP1193Provider, EventMap, Provider } from '@one-inch-community/models';
import { Observable } from 'rxjs';

/**
 * Fork native rxjs fromEvent observer
 * compliant with EIP 1193
 * https://eips.ethereum.org/EIPS/eip-1193
 *
 * NgZone is required in order to handle Change Detection
 * correctly after receiving a message from the wallet browser extension.
 * */
export function fromEIP1193Event<Event extends keyof EventMap>(
    target: EIP1193Provider,
    eventName: Event,
): Observable<EventMap[Event]> {
    return new Observable<EventMap[Event]>((subscriber) => {
        const handler = (event: EventMap[Event]) => {
            subscriber.next(event)
        };
        target.on(eventName, handler);
        return () => {
            if ('removeListener' in target) {
                return target.removeListener(eventName, handler);
            }
            console.warn('unable to unsubscribe from provider', target, eventName);
        };
    });
}
