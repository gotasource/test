import { User } from "../models/User";
export declare class UserService {
    constructor();
    readCategory(lastName: string, firstName: string): User;
    readCategory1(lastName: string, firstName: string): Promise<User>;
}
