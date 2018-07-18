var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import {Hello} from "./service/Hello";
import { GotaApp, GotaBoot } from "./gota-boot";
//import {SiteInfo} from "./models/SiteInfo";
import { SiteInfoService } from "./service/SiteInfoService";
import { Connection } from "./data-access/Connection";
import { ProductService } from "./service/ProductService";
// @GotaApp({
//     name: 'Quick Start',
//     scanner: [Hello],
//     config: {
//         hostName : '127.0.0.1',
//         port: 3000,
//         devMode:true
//     }
// })
// class App{};
//GotaBoot(App);
let SiteInfoApp = class SiteInfoApp {
};
SiteInfoApp = __decorate([
    GotaApp({
        name: 'SiteInfoApp',
        scanner: [SiteInfoService, Connection],
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
GotaBoot(SiteInfoApp);
let ProductApp = class ProductApp {
};
ProductApp = __decorate([
    GotaApp({
        scanner: [ProductService, Connection],
        config: {
            hostName: 'product.gt.com',
            port: 3002,
            devMode: true,
            database: {
                host: 'localhost',
                port: 27017,
                databaseName: 'gota'
            }
        }
    })
], ProductApp);
;
GotaBoot(ProductApp);
