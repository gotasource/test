import {Model} from "../gota-dao/Model";
import {Entity} from "../gota-dao/decorator";
import {Address} from "./Address";

@Entity()
export class User extends Model {
    name:string;email:string;
    phone:string;
    address: Address
    constructor(name:string,  email:string, phone:string){
        super({name:name, email:email, phone:phone});
    }
}