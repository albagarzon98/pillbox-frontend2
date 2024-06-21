import { NameValueStructure } from "../const/chartTypes";

export function countOccurrences(data: any[], propertyToCount: string): NameValueStructure[] {
    let result: NameValueStructure[] = [];

    data.map(element => {
        const existsObject = existValueIn(result, element[propertyToCount]);
        if (existsObject.exists) result[existsObject.index].value++;
        else result.push(new NameValueStructure(element[propertyToCount], 1));
    });

    return result;
}

function existValueIn(array: NameValueStructure[], value: string): { exists: boolean, index: number } {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === value) {
            return { exists: true, index: i };
        }
    }
    return { exists: false, index: -1 };
}