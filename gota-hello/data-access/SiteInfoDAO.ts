import {SiteInfo} from "../models/SiteInfo";
import {DAO} from "../gota-dao/index";

export class SiteInfoDAO extends DAO<SiteInfo> {
    constructor() {
        super(SiteInfo);
    }
}