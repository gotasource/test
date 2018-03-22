export declare class User {
    private lastName;
    private firstName;
    constructor(firstName: string, lastName: string);
}
export declare class UserService {
    constructor();
    readCategory(lastName: string, firstName: string): User;
    readCategory1(lastName: string, firstName: string): Promise<User>;
}
