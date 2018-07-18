import { SiteInfo } from "../models/SiteInfo";
import { DAO } from "./DAO";
export class SiteInfoDAO extends DAO {
    constructor() {
        super(SiteInfo);
    }
}
