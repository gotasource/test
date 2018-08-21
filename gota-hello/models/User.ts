import {Model, Entity, DynamicAccess, DynamicAccessMode} from "../gota-dao/index";
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
    height: Number;
    @DynamicAccess(DynamicAccessMode.READ)
    createDate: Date;
    @DynamicAccess(DynamicAccessMode.READ)
    active: Boolean;
    constructor(name:String, email:String, phone:String, birthday: Date, address: Address, gender: Boolean, weight: Number, height: Number){
        super({name, email, phone, birthday, address, gender, weight, height});
        this.createDate = new Date();
        this.active = false;
    }
}