export class UserModel {
    public id: string;
    public name: string;
    public email: string;
    public password?: string;
    public role: string;
    public pharmacyCode: string;
    public isEnabled: boolean;
}
