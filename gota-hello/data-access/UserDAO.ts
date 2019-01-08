import {SiteInfo} from "../models/SiteInfo";
import {MongoDataAccess, DAO} from "../gota-dao/index";
import { User } from "../models/User";

@DAO(User)
export class UserDAO extends MongoDataAccess<User> {
    constructor() {
        super();
    }
}