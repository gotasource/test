
import {QueryParameter, RequestMethod, Service, ServiceMapping} from '../gota-service';
import {User} from "../models/User";

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn:Function, args:Array<string>) {
    await timeout(3000);
    return fn(...args);
}

@Service({path:'/user-service', models: [User]})
export class UserService{
    constructor(){
    }

    @ServiceMapping({path:['/hi','/hii']})
    readCategory(@QueryParameter lastName:string, @QueryParameter firstName:string): User{
        let user = new User(firstName, lastName, null);
        return user;
    }

    @ServiceMapping({requestMethod:[RequestMethod.GET,RequestMethod.PUT], path: '/bye'})
    async readCategory1(@QueryParameter lastName:string, @QueryParameter firstName:string):Promise<User>{
        return await sleep(this.readCategory, [lastName, firstName]);
    }
}