import {SiteInfo} from "../models/SiteInfo";
import {MongoDataAccess} from "../gota-dao/index";
import { DAO } from "../gota-dao/decorator";
import { User } from "../models/User";

@DAO(User)
export class UserDAO extends MongoDataAccess<User> {
    constructor() {
        super(null);
    }
}