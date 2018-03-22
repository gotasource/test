import { SiteInfo } from "../models/SiteInfo";
import { SiteInfoDAO } from "../data-access/SiteInfoDAO";
export declare class SiteInfoService {
    siteInfoDAO: SiteInfoDAO;
    constructor();
    getSiteInfo(referer: String, id: String): Promise<SiteInfo>;
}
