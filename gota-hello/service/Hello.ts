import {Path, Method, PathParameter, Body, RequestMethod, QueryParameter} from 'gota-service'
function timeout(ms:Number) {
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

@Path('/hello')
export class Hello{
    constructor(){
    }

    @Method(RequestMethod.GET)
    @Path('/hi')
    readCategory(@QueryParameter lastName:string, @QueryParameter firstName:string): User{
        let user = new User(firstName, lastName);
        return user;
    }

    @Method(RequestMethod.GET)
    @Path('/bye')
    async readCategory1(@QueryParameter lastName:string, @QueryParameter firstName:string):Promise<User>{
        return await sleep(this.readCategory, [lastName, firstName]);
    }
}