import { Model } from "../gota-dao/Model";
import { Address } from "./Address";
export declare class User extends Model {
    name: String;
    email: String;
    phone: String;
    address: Address;
    constructor(name: string, email: string, phone: string);
}
