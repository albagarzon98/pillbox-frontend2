export class Reminder {
    startDate: Date;
    endDate: Date;
    unit: string;
    frequency: string;
    medicationName: string;
    dose: number;
    inventory: number;
    grammage: number;
    isTutorAssigned: boolean;

    constructor() {
        this.startDate = new Date();
        this.endDate = new Date();
        this.unit = "";
        this.frequency = "";
        this.medicationName = "";
        this.dose = 0;
        this.inventory = 0;
        this.grammage = 0;
        this.isTutorAssigned = false;
    }
}
