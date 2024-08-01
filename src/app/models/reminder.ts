export class Reminder {
    startDate: string;
    endDate: string;
    unit: string;
    frequency: string;
    medicationName: string;
    dose: number;
    inventory: number;
    grammage: number;
    isTutorAssigned: boolean;

    constructor() {
        this.startDate = "";
        this.endDate = "";
        this.unit = "";
        this.frequency = "";
        this.medicationName = "";
        this.dose = 0;
        this.inventory = 0;
        this.grammage = 0;
        this.isTutorAssigned = false;
    }
}
