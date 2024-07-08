import { genRandomHex } from '@one-inch-community/core/random';

export function getNotificationId(): string {
  return genRandomHex(10)
}
