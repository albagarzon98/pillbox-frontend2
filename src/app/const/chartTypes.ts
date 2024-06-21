export class NameValueStructure {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

export const chartTypes = {
    pieChart: {
        name: "pieChart",
        dataStructure: NameValueStructure
    }
};