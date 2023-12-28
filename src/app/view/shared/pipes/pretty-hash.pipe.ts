import { Pipe, PipeTransform } from '@angular/core';

export type PrettyHashPipeParams = {
    width?: number,
    head?: number,
    tail?: number,
};

@Pipe({
    name: 'prettyHash',
    pure: true,
    standalone: true,
})
export class PrettyHashPipe implements PipeTransform {
    transform(addressOrHash: string | null, params: PrettyHashPipeParams = {}): string {
        if (typeof addressOrHash !== 'string') {
            // Had a cases when non string values were passed
            return '';
        }

        const {
            width,
            head = 6,
            tail = 4,
        } = params;

        if (width !== undefined && (width > 1410 || (940 > width && width > 800))) {
            return addressOrHash;
        }

        return `${addressOrHash.slice(0, head)}...${addressOrHash.slice(addressOrHash.length - tail)}`;
    }
}
