import { ChainId } from '@one-inch-community/models';

export enum Events {
  chainChangeId = 'chainChangeId',
  changeId = 'changeId',
  getChangeId = 'getChangeId',
}

export type EventsDataType = {
  [Events.chainChangeId]: ChainId
  [Events.changeId]: ChainId
  [Events.getChangeId]: never
}

const prefix = 'one-inch'

export function emitGlobalEvent<K extends Events>(name: K, detail?: EventsDataType[K]): void {
  const event = new CustomEvent(formatEvent(name), { detail })
  window.dispatchEvent(event)
}

export function waitGlobalEvent<K extends Events>(name: K, maximumWaitTimeInMs?: number): Promise<EventsDataType[K]> {
  return new Promise((resolve, reject) => {
    let timer: any
    const eventName = formatEvent(name)
    const handler = (event: CustomEvent<EventsDataType[K]>) => {
      timer && clearTimeout(timer)
      resolve(event.detail)
    }

    window.addEventListener<any>(eventName, handler, { once: true, passive: true })

    if (typeof maximumWaitTimeInMs === 'number') {
      timer = setTimeout(() => reject(new Error('Event waiting time exceeded')), maximumWaitTimeInMs)
    }
  })
}

export function listenGlobalEvent<K extends Events>(name: K, handler: (event: CustomEvent<EventsDataType[K]>) => void) {
  window.addEventListener<any>(formatEvent(name), handler, { passive: true })
}

export function removeGlobalEvent<K extends Events>(name: K, handler: (event: CustomEvent<EventsDataType[K]>) => void) {
  window.removeEventListener<any>(formatEvent(name), handler)
}

function formatEvent(name: string): string {
  return [prefix, name].join(':')
}