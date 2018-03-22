import {SiteInfo} from "../models/SiteInfo";
import {DAO} from "./DAO";

export class SiteInfoDAO extends DAO<SiteInfo> {
    constructor() {
        super(SiteInfo);
    }
}