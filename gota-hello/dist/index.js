"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const gota_boot_1 = require("./gota-boot");
const Connection_1 = require("./gota-dao/Connection");
const UserService_1 = require("./service/UserService");
let ProductApp = class ProductApp {
};
ProductApp = __decorate([
    gota_boot_1.GotaApp({
        scanner: [UserService_1.UserService, Connection_1.Connection],
        config: {
            hostName: 'localhost',
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
gota_boot_1.GotaBoot(ProductApp);
//# sourceMappingURL=index.js.map