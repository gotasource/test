
import {QueryParameter, RequestMethod, Service, ServiceMapping} from '../gota-service';
import {User} from "../models/User";
import {Address} from "../models/Address";
import {BodyParameter, Body} from "../gota-service/index";
import { Autowired } from '../gota-injection';
import { UserDAO } from '../data-access/UserDAO';
import { FileWrapper } from '../gota-server';

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn:Function, args:Array<string>) {
    await timeout(3000);
    return fn(...args);
}

@Service({path:'/user-service'})
export class UserService{
    @Autowired
    private userDAO: UserDAO;
    constructor(){
    }

    @ServiceMapping({path:['/hi','/hii']})
    hi(@QueryParameter firstName:String, @QueryParameter lastName:String, @QueryParameter email: String, @QueryParameter phone:String, @QueryParameter birthday: Date, @QueryParameter gender: Boolean, @QueryParameter weight: Number, @QueryParameter height: Number): User{
        let user = new User(firstName +' '+ lastName, email, phone, birthday, null, gender, weight, height);
        return user;
    }

    @ServiceMapping({requestMethod:RequestMethod.POST, path:'/bye'})
    bye(@BodyParameter firstName:String, @BodyParameter lastName:String, @BodyParameter email: String, @BodyParameter phone:String, @BodyParameter address: Address,@BodyParameter birthday: Date, @BodyParameter gender: Boolean, @BodyParameter weight: Number, @BodyParameter height: Number): User{
        let user = new User(firstName +' '+ lastName, email, phone, birthday, address, gender, weight, height);
        return user;
    }

    @ServiceMapping({requestMethod:RequestMethod.POST, path:'/bye1'})
    bye1(@Body user: User): User{
        return user;
    }

    @ServiceMapping({path:'/create-template/', requestMethod: RequestMethod.POST})
    createTemplate(@BodyParameter name: String, @BodyParameter description: String, @BodyParameter avatar: FileWrapper): string{
       console.log('name: '+ name)
       return "";
    }
}