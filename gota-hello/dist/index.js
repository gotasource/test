"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const gota_boot_1 = require("./gota-boot");
const SiteInfoService_1 = require("./service/SiteInfoService");
const Connection_1 = require("./gota-dao/Connection");
let SiteInfoApp = class SiteInfoApp {
};
SiteInfoApp = __decorate([
    gota_boot_1.GotaApp({
        name: 'SiteInfoApp',
        scanner: [SiteInfoService_1.SiteInfoService, Connection_1.Connection],
        config: {
            hostName: 'site-info.gt.com',
            port: 3001,
            devMode: true,
            database: {
                host: 'localhost',
                port: 27017,
                databaseName: 'gota'
            }
        }
    })
], SiteInfoApp);
;
gota_boot_1.GotaBoot(SiteInfoApp);
//# sourceMappingURL=index.js.map