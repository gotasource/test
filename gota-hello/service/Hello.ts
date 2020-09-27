
import {QueryParameter, RequestMethod, Service, ServiceMapping} from '../gota-service';
import {ApplicationFilter, ServerFilter, ServiceFilter} from "../gota-server";
import {ServiceFilterTest1} from "./filters/filter";

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(contex:any, fn:Function, args:Array<string>) {
    await timeout(3000);
    return fn.apply(contex, args);
}




export class User{

    private lastName:string;
    private firstName:string;
    constructor(firstName: string, lastName: string){
        this. lastName = lastName;
        this.firstName = firstName;
    }

}

@Service({path:'/hello', filters: [ServiceFilterTest1]})
export class Hello{

    constructor(){
    }

    @ServiceMapping({path:['/hi','/hii']})
    readCategory(@QueryParameter lastName:string, @QueryParameter firstName:string): User{
        let user = new User(firstName, lastName);
        return user;
    }

    @ServiceMapping({requestMethod:[RequestMethod.GET,RequestMethod.PUT], path: '/bye'})
    async readCategory1(@QueryParameter lastName:string, @QueryParameter firstName:string):Promise<User>{
        return await sleep(this, this.readCategory, [lastName, firstName]);
    }
    @ServiceMapping({requestMethod:[RequestMethod.GET,RequestMethod.PUT], path: '/bye'})
    async readCategoryww(@QueryParameter lastName:string, @QueryParameter firstName:string):Promise<Array<User>>{
        return await sleep(this, this.readCategory, [lastName, firstName]);
    }

}