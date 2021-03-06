import {SiteInfo} from "../models/SiteInfo";
import {MongoDataAccess} from "../gota-dao/index";
import { DAO } from "../gota-dao/decorator";

@DAO(SiteInfo)
export class SiteInfoDAO extends MongoDataAccess<SiteInfo> {
    constructor() {
        super(null);
    }
}