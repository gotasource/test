import {Model,Entity} from "../gota-dao/index";
import {Address} from "./Address";

@Entity()
export class User extends Model {
    name:String;
    email:String;
    phone:String;
    address: Address
    constructor(name:string,  email:string, phone:string){
        super({name:name, email:email, phone:phone});
    }
}