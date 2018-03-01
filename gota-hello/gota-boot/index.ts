import "reflect-metadata";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  compression from 'compression';
import Booter from "./Booter";

const DESIGN_META_DATA = {
    APP : 'design:meta:data:key:app',
    CONFIG : 'design:meta:data:key:config',
    SERVICE : 'design:meta:data:key:service',
    PATH : 'design:meta:data:key:path',
    METHOD : 'design:meta:data:key:method',
    PATH_PARAMETER : 'design:meta:data:key:path:parameter',
    REQUEST : 'design:meta:data:key:request',
    RESPONSE : 'design:meta:data:key:response',
    QUERY : 'design:meta:data:key:query',
    QUERY_PARAMETER : 'design:meta:data:key:query:parameter',
    BODY : 'design:meta:data:key:body',
    BODY_PARAMETER : 'design:meta:data:key:body:parameter',
    HEADERS : 'design:meta:data:key:headers',
    HEADERS_PARAMETER : 'design:meta:data:key:headers:parameter'
};

const REQUEST_METHOD = {
    GET :'get',
    POST :'post',//create
    PUT :'put',// replace
    PATCH : 'patch',// update
    DELETE : 'delete'
};

export function GotaApp(obj:{name?: string, scanner:Array<Function>, config:object}) {
    return Reflect.metadata(DESIGN_META_DATA.APP, obj);
}


function initApp(){
    let app = express();
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, token');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        //res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
        next();
    });
    return app;
}


export function GotaBoot(appClass: Function) {
    let gotaAppMetadata  = Reflect.getMetadata(DESIGN_META_DATA.APP, appClass);
    let serviceClasses: Array<any> = gotaAppMetadata.scanner;
    let config = gotaAppMetadata.config;
    if(!serviceClasses){
        throw new Error('Please make sure "scanner" in "@GotaApp" Metadata of "'+appClass.name+'" is not empty.');
    }
    if(!Array.isArray(serviceClasses)){
        serviceClasses = [serviceClasses];
    }

    let app = initApp();

    serviceClasses.forEach(serviceClass => {
        let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        let serviceConfig = Object.assign({},config, serviceMetaData.config);
        Reflect.defineMetadata(DESIGN_META_DATA.CONFIG, serviceConfig, serviceClass);
        Booter.bootService(app, new serviceClass());
        app.listen(config.port, function () {
            console.log('>> %s app is listening at %s <<',gotaAppMetadata.name , config.port);
        });
    })
}