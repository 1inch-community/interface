import { beforeEach, it, expect, describe, beforeAll } from 'vitest';
import { ButtonElement } from './button.element';

describe('Button', () => {
  let button: ButtonElement

  beforeEach(() => {
    button = new ButtonElement()
  })

  beforeAll(() => {
    global.window.matchMedia = global.window.matchMedia || (() => {
      return {
        matches: false,
        addEventListener: () => void 0,
        removeEventListener: () => void 0,
      };
    });
  });

  it('should create successfully', () => {
    expect(button).toBeTruthy();
  });

})
