import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'toFixed',
    standalone: true
})
export class ToFixedPipe implements PipeTransform {

    transform(value: number | string, fractionDigits = 2): string {
        let stringValue = `${value}`
        if (stringValue.includes('e-')) {
            stringValue = Number(value).toFixed(100)
        }
        let innerFractionDigits = fractionDigits
        let result = ''
        let dotIsFine = false
        let chartAfterDot = 0;
        let prevChart = ''
        for(const char of stringValue) {
            if (dotIsFine && char === '0' && (prevChart === '0' || prevChart === '.')) {
                innerFractionDigits++
            }
            if (chartAfterDot === innerFractionDigits) {
                return result;
            }
            if (dotIsFine) {
                chartAfterDot++
            }
            if (char === '.') {
                dotIsFine = true
            }
            result += char
            prevChart = char
        }
        return result;
    }
}
