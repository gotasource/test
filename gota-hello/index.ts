//import {Hello} from "./service/Hello";
import {GotaApp, GotaBoot} from "./gota-boot";
//import {SiteInfo} from "./models/SiteInfo";
import {SiteInfoService} from "./service/SiteInfoService";
import {MongoConnection} from "./gota-dao/MongoConnection";
import {ProductService} from "./service/ProductService";
import {UserService} from "./service/UserService";

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


//@GotaApp({
//    name: 'SiteInfoApp',
//    scanner: [SiteInfoService, Connection],
//    config: {
//        hostName : 'localhost',
//        port: 3000,
//        devMode:true,
//        database: {
//            host: 'localhost',
//            port: 27017,
//            databaseName:'gota'
//
//        }
//    }
//})
//class SiteInfoApp{};
//GotaBoot(SiteInfoApp);


process.on('unhandledRejection', (...error) => {
    // Will print "unhandledRejection err is not defined"
    console.log('unhandledRejection',  error[0].message);
});

@GotaApp({
    scanner: [UserService, MongoConnection],
    config: {
        hostName : 'localhost',
        port: 3002,
        devMode:true,
        database: {
            protocol:'mongodb+srv',
            host: 'cluster0-g6wi8.gcp.mongodb.net/test?retryWrites=true',
            user: 'admin',
            password: 'iC2gjdMkgrjDwF03',
            // options:{},
            databaseName:'gota'
        },
/*
        database: {
            url: 'mongodb+srv://admin:iC2gjdMkgrjDwF03@cluster0-g6wi8.gcp.mongodb.net/test?retryWrites=true',
            protocol:'mongodb',
            host: 'localhost',
            port: 27017,
            databaseName:'gota',
        }
        */
    }
})
class ProductApp{};
GotaBoot(ProductApp);


