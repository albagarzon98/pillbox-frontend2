export class PharmacyRequest {
    id: string;
    pharmacyName: string;
    address: string;
    phoneNumber: number;
    contactEmail: string;
    branchesNumber: number;
    creationDate: string;

    constructor() {
        this.id = "";
        this.pharmacyName = "";
        this.address = "";
        this.phoneNumber = 0;
        this.contactEmail = "";
        this.branchesNumber = 0;
        this.creationDate = "";
    }
}
