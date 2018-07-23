import {Model} from "../gota-dao/Model";

export class User extends Model {
    name:string;
    email:string;
    phone:string;
    constructor(name:string,  email:string, phone:string){
        super({name:name, email:email, phone:phone});
    }
}