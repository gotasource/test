"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
const gota_service_1 = require("../gota-service");
const gota_injection_1 = require("../gota-injection");
const gota_core_1 = require("../gota-core");
const SiteInfo_1 = require("../models/SiteInfo");
const SiteInfoDAO_1 = require("../data-access/SiteInfoDAO");
let SiteInfoService = class SiteInfoService {
    constructor() { }
    getSiteInfo(referer, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let siteInfo = new SiteInfo_1.SiteInfo({});
            referer = referer || 'http://localhost:4200/';
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
    gota_injection_1.Autowired,
    __metadata("design:typeinfo", {
        type: () => SiteInfoDAO_1.SiteInfoDAO
    })
], SiteInfoService.prototype, "siteInfoDAO", void 0);
__decorate([
    gota_service_1.ServiceMapping({ path: '/site-info/:id', requestMethod: gota_service_1.RequestMethod.GET }), gota_core_1.AwaitedType(SiteInfo_1.SiteInfo),
    __param(0, gota_service_1.HeadersParameter), __param(1, gota_service_1.PathParameter),
    __metadata("design:typeinfo", {
        type: () => Function,
        paramTypes: () => [String, String],
        returnType: () => Promise
    })
], SiteInfoService.prototype, "getSiteInfo", null);
SiteInfoService = __decorate([
    gota_service_1.Service({ path: '/site-service', models: [SiteInfo_1.SiteInfo] }),
    __metadata("design:typeinfo", {
        paramTypes: () => []
    })
], SiteInfoService);
exports.SiteInfoService = SiteInfoService;
//# sourceMappingURL=SiteInfoService.js.map