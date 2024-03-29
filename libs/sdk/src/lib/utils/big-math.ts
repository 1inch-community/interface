export class BigMath {

  private constructor() {
    throw new Error('BigMath not support instance creating use static methods: dev, mul, add, sub');
  }

  static dev(
    numerator: bigint,
    denominator: bigint,
    numeratorDecimals: number,
    denominatorDecimals: number,
    resultDecimals: number = denominatorDecimals
  ): bigint {
    if (denominator === 0n) {
      throw new Error('Division by zero.');
    }
    if (numerator === 0n) {
      return 0n;
    }

    const scale = BigInt(10) ** BigInt(Math.max(numeratorDecimals, denominatorDecimals));
    numerator = numerator * (scale / (BigInt(10) ** BigInt(numeratorDecimals)));
    denominator = denominator * (scale / (BigInt(10) ** BigInt(denominatorDecimals)));
    const resultScale = BigInt(10) ** BigInt(resultDecimals);
    numerator = numerator * resultScale;
    return numerator / denominator;
  }

  static mul(
    valueA: bigint,
    valueB: bigint,
    valueADecimals: number,
    valueBDecimals: number,
    resultDecimals: number = valueBDecimals
  ): bigint {
    if (valueA === 0n || valueB === 0n) {
      return 0n;
    }

    const product = valueA * valueB;
    const scale = (BigInt(10) ** BigInt(valueADecimals + valueBDecimals)) / (BigInt(10) ** BigInt(resultDecimals));
    return product / scale;
  }

  static add(
    valueA: bigint,
    valueB: bigint,
    valueADecimals: number,
    valueBDecimals: number,
    resultDecimals: number = valueBDecimals
  ): bigint {
    const maxDecimals = Math.max(valueADecimals, valueBDecimals, resultDecimals);
    valueA = valueA * (BigInt(10) ** BigInt(maxDecimals - valueADecimals));
    valueB = valueB * (BigInt(10) ** BigInt(maxDecimals - valueBDecimals));

    const sum = valueA + valueB;
    if (resultDecimals < maxDecimals) {
      return sum / (BigInt(10) ** BigInt(maxDecimals - resultDecimals));
    }
    return sum
  }

  static sub(
    valueA: bigint,
    valueB: bigint,
    valueADecimals: number,
    valueBDecimals: number,
    resultDecimals: number = valueBDecimals
  ): bigint {
    const maxDecimals = Math.max(valueADecimals, valueBDecimals, resultDecimals);
    valueA = valueA * (BigInt(10) ** BigInt(maxDecimals - valueADecimals));
    valueB = valueB * (BigInt(10) ** BigInt(maxDecimals - valueBDecimals));

    const difference = valueA - valueB;
    if (resultDecimals < maxDecimals) {
      return difference / (BigInt(10) ** BigInt(maxDecimals - resultDecimals));
    }
    return difference;
  }

  static avr(
    numbers: bigint[],
    numbersDecimals: number,
    resultDecimals: number = numbersDecimals,
  ): bigint {
    if (numbers.length === 0) {
      return 0n
    }
    const scale = BigInt(10) ** BigInt(resultDecimals);
    const scaledNumbers = numbers.map(num => num * scale / (BigInt(10) ** BigInt(numbersDecimals)));
    const sum = scaledNumbers.reduce((acc, curr) => acc + curr, BigInt(0));
    return sum / BigInt(numbers.length)
  }
}