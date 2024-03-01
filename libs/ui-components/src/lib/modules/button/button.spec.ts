import { beforeEach, it, expect, describe } from 'vitest';
import { ButtonElement } from './button.element';

describe('Button', () => {
  let button: ButtonElement

  beforeEach(() => {
    button = new ButtonElement()
  })

  it('should create successfully', () => {
    expect(button).toBeTruthy();
  });

})