var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HeadersParameter, RequestMethod, Service, ServiceMapping, Autowired, PathParameter } from '../gota-service';
import { SiteInfo } from "../models/SiteInfo";
let SiteInfoService = class SiteInfoService {
    constructor() {
    }
    getSiteInfo(referer, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let siteInfo = new SiteInfo({});
            referer = referer || 'http://localhost:4200/'; //for test
            if (referer) {
                let hostName = referer.match(/:\/\/(.[^(/|:)]+)/)[1];
                let siteInfos = yield this.siteInfoDAO.search({ hostName: hostName });
                siteInfo = (siteInfos && siteInfos.length > 0) ? siteInfos[0] : siteInfo;
            }
            return siteInfo;
        });
    }
};
__decorate([
    Autowired
], SiteInfoService.prototype, "siteInfoDAO", void 0);
__decorate([
    ServiceMapping({ path: '/site-info/:id', requestMethod: RequestMethod.GET }),
    __param(0, HeadersParameter), __param(1, PathParameter)
], SiteInfoService.prototype, "getSiteInfo", null);
SiteInfoService = __decorate([
    Service({ path: '/site-service', models: [SiteInfo] })
], SiteInfoService);
export { SiteInfoService };
