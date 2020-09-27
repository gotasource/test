//import {Hello} from "./service/Hello";
import {GotaApp, GotaBoot} from "./gota-boot";
//import {SiteInfo} from "./models/SiteInfo";
import {SiteInfoService} from "./service/SiteInfoService";
import {MongoConnection} from "./gota-dao/MongoConnection";
import {ProductService} from "./service/ProductService";
import {UserService} from "./service/UserService";
import {ServerFilter} from "./gota-server/filter/ServerFilter";
import {ApplicationFilter} from "./gota-server/filter/ApplicationFilter";
import {Hello} from "./service/Hello";

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
    console.log('unhandledRejection',  error);
});

class TestRequestFilter1 implements ApplicationFilter{
    async doFilter(request: any, response: any, next: Function) {
        console.log(">>>>>> TestRequestFilter1");
        await next();
    }
}

class TestRequestFilter2 implements ApplicationFilter{
    async doFilter(request: any, response: any, next: Function) {
        console.log(">>>>>> TestRequestFilter2")
        await next();
    }
}


@GotaApp({
    // filters:[TestRequestFilter1, TestRequestFilter2],
    scanner: [UserService, Hello],
    config: {
        hostName : 'localhost',
        port: 3000,
        devMode:true,
        database: {
            protocol: "mongodb+srv",
            user: "iclinic-admin",
            password: "Mlk58Gr2PwRIQdoQ",
            clusterUrl: "cluster0.je2ou.mongodb.net",
            databaseName: "product",
            queryParams: {
                retryWrites: true,
                w: "majority"
            },
            url: "mongodb+srv://iclinic-admin:Mlk58Gr2PwRIQdoQ@cluster0.je2ou.mongodb.net/dtc?retryWrites=true&w=majority",
            options: {
                useNewUrlParser: true
            }
        }
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


