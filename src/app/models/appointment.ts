import { UserModel } from '../models/user';

export class Appointment {
    id: string;
    startTime: string;
    endTime: string;
    reservationDate: string;
    branchId: string;
    branchName: string;
    pharmacistUser: UserModel;
    status: string;
    assignedUser: UserModel;
}
