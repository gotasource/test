import {Model,Entity} from "../gota-dao/index";
import {Address} from "./Address";

@Entity()
export class User extends Model {
    name:String;
    email:String;
    phone:String;
    birthday: Date;
    address: Address;
    gender: Boolean;
    weight: Number;
    height: Number
    constructor(name:String, email:String, phone:String, birthday: Date, address: Address, gender: Boolean, weight: Number, height: Number){
        super({name, email, phone, birthday, address, gender, weight, height});
    }
}