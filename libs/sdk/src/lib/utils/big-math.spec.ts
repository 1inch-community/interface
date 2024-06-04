import { it, expect, describe } from 'vitest';
import { BigMath } from './big-math';

describe('BigMath', () => {

  it('dev', () => {
    expect(BigMath.div(
      2368452n,
      23651n,
      11,
      5,
      3
    )).toBe(0n)

    expect(BigMath.div(
      2368452n,
      23651n,
      11,
      5,
      8
    )).toBe(10014n)

    expect(BigMath.div(
      123456n,
      7899999n,
      8,
      18,
      2
    )).toBe(15627343750n)

    expect(() => BigMath.div(
      20n,
      0n,
      2,
      2)
    ).toThrow(Error);
  })

  it('mul', () => {
    expect(BigMath.mul(
      2368452n,
      23651n,
      11,
      5,
      3
    )).toBe(0n)

    expect(BigMath.mul(
      2368452n,
      23651n,
      11,
      5,
      8
    )).toBe(560n)

    expect(BigMath.mul(
      123456n,
      7899999n,
      8,
      18,
      24
    )).toBe(9753022765n)

    expect(BigMath.mul(
      0n,
      7899999n,
      8,
      18,
      24
    )).toBe(0n)

    expect(BigMath.mul(
      123456n,
      0n,
      8,
      18,
      24
    )).toBe(0n)

    expect(BigMath.mul(
      1000000n,
      261n,
      6,
      6,
      18
    )).toBe(261000000000000n)
  })

  it('add', () => {
    expect(BigMath.add(
      2368452n,
      23651n,
      11,
      5,
      3
    )).toBe(236n)

    expect(BigMath.add(
      2368452n,
      23651n,
      11,
      5,
      8
    )).toBe(23653368n)

    expect(BigMath.add(
      123456n,
      7899999n,
      8,
      18,
      24
    )).toBe(1234560007899999000000n)

    expect(BigMath.add(
      0n,
      7899999n,
      8,
      18,
      24
    )).toBe(7899999000000n)

    expect(BigMath.add(
      123456n,
      0n,
      8,
      18,
      24
    )).toBe(1234560000000000000000n)
  })

  it('sub', () => {
    expect(BigMath.sub(
      2368452n,
      23651n,
      11,
      5,
      3
    )).toBe(-236n)

    expect(BigMath.sub(
      2368452n,
      23651n,
      11,
      5,
      8
    )).toBe(-23648631n)

    expect(BigMath.sub(
      123456n,
      7899999n,
      8,
      18,
      24
    )).toBe(1234559992100001000000n)

    expect(BigMath.sub(
      0n,
      7899999n,
      8,
      18,
      24
    )).toBe(-7899999000000n)

    expect(BigMath.sub(
      123456n,
      0n,
      8,
      18,
      24
    )).toBe(1234560000000000000000n)
  });

  it('avr', () => {
    expect(BigMath.avr([
      100n,
      100n,
      100n,
    ], 10, 8)).toBe(1n)
    expect(BigMath.avr([
      100n,
      100n,
      100n,
    ], 2, 8)).toBe(100000000n)
    expect(BigMath.avr([
      100n,
      100n,
      100n,
    ], 2)).toBe(100n)
    expect(BigMath.avr([
      100n,
      100n,
      100n,
    ], 0)).toBe(100n)
  })

  it('pow', () => {
    expect(BigMath.pow(
      123456n,
      0,
      8,
      18
    )).toBe(1000000000000000000n)

    expect(BigMath.pow(
      123456n,
      2,
      8,
      18,
    )).toBe(152413839360000000000n)
  })

  it('min', () => {
    expect(BigMath.min(
      1n, 2n, 3n, 4n,
    )).toBe(1n)
  })

  it('max', () => {
    expect(BigMath.max(
      1n, 2n, 3n, 4n,
    )).toBe(4n)
  })

})
