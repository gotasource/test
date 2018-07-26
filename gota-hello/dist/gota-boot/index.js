"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Booter_1 = require("./Booter");
const gota_server_1 = require("../gota-server");
const DESIGN_META_DATA = {
    APP: 'design:meta:data:key:app',
    CONFIG: 'design:meta:data:key:config',
    POST_INIT: 'design:meta:data:key:post.init',
    AUTOWIRED: 'design:meta:data:key:autowired',
    SERVICE: 'design:meta:data:key:service',
    SERVICE_MAPPING: 'design:meta:data:key:service:mapping',
    PATH: 'design:meta:data:key:path',
    METHOD: 'design:meta:data:key:method',
    PARAMETER: 'design:meta:data:key:parameter',
    PATH_PARAMETER: 'design:meta:data:key:path:parameter',
    REQUEST: 'design:meta:data:key:request',
    RESPONSE: 'design:meta:data:key:response',
    QUERY: 'design:meta:data:key:query',
    QUERY_PARAMETER: 'design:meta:data:key:query:parameter',
    BODY: 'design:meta:data:key:body',
    BODY_PARAMETER: 'design:meta:data:key:body:parameter',
    HEADERS: 'design:meta:data:key:headers',
    HEADERS_PARAMETER: 'design:meta:data:key:headers:parameter'
};
const REQUEST_METHOD = {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};
function GotaApp(obj) {
    return Reflect.metadata(DESIGN_META_DATA.APP, obj);
}
exports.GotaApp = GotaApp;
function initApp() {
    let app = new gota_server_1.default();
    return app;
}
function initConfig(serviceClasses, config) {
    let serviceTargets = [];
    serviceClasses.forEach(serviceClass => {
        let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        let serviceConfig = Object.assign({}, config, serviceMetaData ? serviceMetaData.config : undefined);
        Reflect.defineMetadata(DESIGN_META_DATA.CONFIG, serviceConfig, serviceClass);
        serviceTargets.push(new serviceClass());
    });
    return serviceTargets;
}
function executeMethod(target, methods) {
    let promises = [];
    methods.forEach(method => {
        promises.push(Promise.resolve(target[method]()));
    });
    return Promise.all(promises);
}
function executePostInit(serviceTargets) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(serviceTargets)) {
            for (let i = 0; i < serviceTargets.length; i++) {
                let serviceTarget = serviceTargets[i];
                yield executePostInit(serviceTarget);
            }
        }
        else {
            let serviceTarget = serviceTargets;
            let autowiredProperties = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, serviceTarget) || [];
            for (let i = 0; i < autowiredProperties.length; i++) {
                let property = autowiredProperties[i];
                yield executePostInit(serviceTarget[property]);
            }
            let postInitMethods = Reflect.getMetadata(DESIGN_META_DATA.POST_INIT, serviceTarget) || [];
            yield executeMethod(serviceTarget, postInitMethods);
        }
    });
}
function GotaBoot(appClass) {
    return __awaiter(this, void 0, void 0, function* () {
        let gotaAppMetadata = Reflect.getMetadata(DESIGN_META_DATA.APP, appClass);
        let serviceClasses = gotaAppMetadata.scanner;
        let config = gotaAppMetadata.config;
        if (!serviceClasses) {
            throw new Error('Please make sure "scanner" in "@GotaApp" Metadata of "' + appClass.name + '" is not empty.');
        }
        if (!Array.isArray(serviceClasses)) {
            serviceClasses = [serviceClasses];
        }
        let app = initApp();
        let serviceTargets = initConfig(serviceClasses, config);
        yield executePostInit(serviceTargets);
        serviceTargets.forEach(serviceTarget => {
            let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceTarget.constructor);
            if (serviceMetaData) {
                Booter_1.default.bootService(app, serviceTarget);
            }
        });
        app.listen(config.port, config.hostName, function () {
            console.log(`${gotaAppMetadata.name || appClass.name} is listening at ${config.hostName}:${config.port}`);
        });
    });
}
exports.GotaBoot = GotaBoot;
//# sourceMappingURL=index.js.map