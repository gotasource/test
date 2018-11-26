import {
    QueryParameter, HeadersParameter, RequestMethod, Service, ServiceMapping, PathParameter,
    Body,
} from '../gota-service';
import {Config, Autowired} from '../gota-injection';
import {PostInit} from '../gota-core';
import {SiteInfo} from "../models/SiteInfo";
import {SiteInfoDAO} from "../data-access/SiteInfoDAO";
import {URL} from "url";

@Service({path:'/site-service'})
export class SiteInfoService{

    @Autowired
    public siteInfoDAO: SiteInfoDAO;
    constructor(){ }
    @ServiceMapping({path:'/site-info/:id', requestMethod:RequestMethod.GET})
    async getSiteInfo(@HeadersParameter referer: String, @PathParameter id: String): Promise<SiteInfo>{
        let siteInfo = new SiteInfo({});
        referer = referer || 'http://localhost:4200/'//for test
        if(referer){
            let hostName = referer.match(/:\/\/(.[^(/|:)]+)/)[1];
            let siteInfos : Array<SiteInfo> = await this.siteInfoDAO.search({hostName: hostName});
            siteInfo= (siteInfos && siteInfos.length>0) ? siteInfos[0]: siteInfo;
        }
        return siteInfo;
    }

    // @ServiceMapping({path:'/site-info/:id', requestMethod:RequestMethod.PATCH})
    // async updateSiteInfo(@PathParameter id: String, @Body siteInfo: SiteInfo): Promise<{result: boolean}>{
    //     let result = await this.siteInfoDAO.update(id, siteInfo);
    //     return {result: result};
    // }
}