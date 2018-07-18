//import {Hello} from "./service/Hello";
import {GotaApp, GotaBoot} from "./gota-boot";
//import {SiteInfo} from "./models/SiteInfo";
import {SiteInfoService} from "./service/SiteInfoService";
import {Connection} from "./gota-dao/Connection";
import {ProductService} from "./service/ProductService";

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


@GotaApp({
    name: 'SiteInfoApp',
    scanner: [SiteInfoService, Connection],
    config: {
        hostName : 'site-info.gt.com',
        port: 3001,
        devMode:true,
        database: {
            host: 'localhost',
            port: 27017,
            databaseName:'gota'

        }
    }
})
class SiteInfoApp{};
GotaBoot(SiteInfoApp);
/*
@GotaApp({
    scanner: [ProductService, Connection],
    config: {
        hostName : 'product.gt.com',
        port: 3002,
        devMode:true,
        database: {
            host: 'localhost',
            port: 27017,
            databaseName:'gota'

        }
    }
})
class ProductApp{};
GotaBoot(ProductApp);
*/