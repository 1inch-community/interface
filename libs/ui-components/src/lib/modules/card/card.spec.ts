import { beforeEach, describe, expect, it } from 'vitest';
import { CardElement } from './card.element';

describe('Card', () => {
  let card: CardElement

  beforeEach(() => {
    card = new CardElement()
  })

  it('should create successfully', () => {
    expect(card).toBeTruthy();
  });

})