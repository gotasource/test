
import {QueryParameter, RequestMethod, Service, ServiceMapping} from "../gota-service";

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn:Function, args:Array<string>) {
    await timeout(3000);
    return fn(...args);
}
export class User{

    private lastName:string;
    private firstName:string;
    constructor(firstName: string, lastName: string){
        this. lastName = lastName;
        this.firstName = firstName;
    }

}

@Service({path:'/hello'})
export class Hello{
    constructor(){
    }

    @ServiceMapping({path:'./hi'})
    readCategory(@QueryParameter lastName:string, @QueryParameter firstName:string): User{
        let user = new User(firstName, lastName);
        return user;
    }

    @ServiceMapping({requestMethod:RequestMethod.GET, path: '/bye'})
    async readCategory1(@QueryParameter lastName:string, @QueryParameter firstName:string):Promise<User>{
        return await sleep(this.readCategory, [lastName, firstName]);
    }
}