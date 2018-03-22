import "reflect-metadata";
import Booter from "./Booter";
import GotaServer from "../gota-server";

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
    OPTIONS: 'OPTIONS',
    GET :'GET',
    POST :'POST',//CREATE
    PUT :'PUT',// REPLACE
    PATCH : 'PATCH',// UPDATE
    DELETE : 'DELETE'
};

export function GotaApp(obj:{name?: string, scanner:Array<Function>, config:object}) {
    return Reflect.metadata(DESIGN_META_DATA.APP, obj);
}


function initApp(){
    let app = new GotaServer();
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
    //console.log(`${gotaAppMetadata.name || appClass.name} is starting at ${config.hostName}:${config.port}`);
    serviceClasses.forEach(serviceClass => {
         let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        let serviceConfig = Object.assign({},config, serviceMetaData? serviceMetaData.config: undefined);
        Reflect.defineMetadata(DESIGN_META_DATA.CONFIG, serviceConfig, serviceClass);
        if(serviceMetaData){
            let models = serviceMetaData.models;
            Booter.bootModels(app, serviceMetaData.path, models);
			Booter.bootService(app, new serviceClass());
		}
    });
	app.listen(config.port, config.hostName,function () {
	    console.log(`${gotaAppMetadata.name || appClass.name} is listening at ${config.hostName}:${config.port}`);
    });
}