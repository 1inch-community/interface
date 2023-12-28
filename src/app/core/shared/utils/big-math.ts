import { Big } from 'big.js'
import {formatUnits, parseUnits} from "viem";


export class BigMath {
    private constructor() {}

    /**
     * division
     * dividend / divider
     * */
    static dev(
        dividend: bigint,
        divider: bigint,
        dividendDecimals: number,
        dividerDecimals: number,
        resultDecimals: number = dividerDecimals
    ): bigint {
        const dividendBN = Big(formatUnits(dividend, dividendDecimals))
        const dividerBN = Big(formatUnits(divider, dividerDecimals))
        return parseUnits(dividendBN.div(dividerBN).toString(), resultDecimals)
    }

    /**
     * multiplication
     * multiplier1 * multiplier2
     * */
    static mul(
        multiplier1: bigint,
        multiplier2: bigint,
        multiplier1Decimals: number,
        multiplier2Decimals: number,
        resultDecimals: number = multiplier2Decimals,
    ): bigint {
        const m1BN = Big(formatUnits(multiplier1, multiplier1Decimals))
        const m2BN = Big(formatUnits(multiplier2, multiplier2Decimals))
        return parseUnits(m1BN.mul(m2BN).toString(), resultDecimals)
    }

    /**
     * average value
     * (n1 + n2 + n3 + ... + n) / (count n)
     * */
    static avr(values: bigint[], decimals: number): bigint {
        const sum = values.reduce((avr, value) => avr + value, 0n)
        if (sum === 0n) {
            return sum
        }
        const sumBN = Big(formatUnits(sum, decimals))
        return parseUnits(sumBN.div(values.length).toString(), decimals)
    }

    static eq(value1: string | bigint, value2: string | bigint, decimals: number) {
        const v1BInt = typeof value1 === "bigint" ? value1 : parseUnits(value1.toString(), decimals)
        const v2BInt = typeof value2 === "bigint" ? value2 : parseUnits(value2.toString(), decimals)
        const v1BN = Big(formatUnits(v1BInt, decimals))
        const v2BN = Big(formatUnits(v2BInt, decimals))
        return v1BN.eq(v2BN)
    }

}
