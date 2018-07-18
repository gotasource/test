"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("reflect-metadata");
var Booter_1 = require("./Booter");
var gota_server_1 = require("../gota-server");
var DESIGN_META_DATA = {
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
var REQUEST_METHOD = {
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
    var app = new gota_server_1["default"]();
    return app;
}
function initConfig(serviceClasses, config) {
    var serviceTargets = [];
    serviceClasses.forEach(function (serviceClass) {
        var serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        var serviceConfig = Object.assign({}, config, serviceMetaData ? serviceMetaData.config : undefined);
        Reflect.defineMetadata(DESIGN_META_DATA.CONFIG, serviceConfig, serviceClass);
        if (serviceMetaData) {
            serviceTargets.push(new serviceClass());
        }
    });
    return serviceTargets;
}
function executeMethod(target, methods) {
    var promises = [];
    methods.forEach(function (method) {
        promises.push(Promise.resolve(target[method]()));
    });
    return Promise.all(promises);
}
function executePostInit(serviceTargets) {
    return __awaiter(this, void 0, void 0, function () {
        var i, serviceTarget, serviceTarget, autowiredProperties, i, property, postInitMethods;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Array.isArray(serviceTargets)) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < serviceTargets.length)) return [3 /*break*/, 4];
                    serviceTarget = serviceTargets[i];
                    return [4 /*yield*/, executePostInit(serviceTarget)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 11];
                case 5:
                    serviceTarget = serviceTargets;
                    autowiredProperties = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, serviceTarget) || [];
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < autowiredProperties.length)) return [3 /*break*/, 9];
                    property = autowiredProperties[i];
                    return [4 /*yield*/, executePostInit(serviceTarget[property])];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9:
                    postInitMethods = Reflect.getMetadata(DESIGN_META_DATA.POST_INIT, serviceTarget) || [];
                    return [4 /*yield*/, executeMethod(serviceTarget, postInitMethods)];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
function GotaBoot(appClass) {
    return __awaiter(this, void 0, void 0, function () {
        var gotaAppMetadata, serviceClasses, config, app, serviceTargets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gotaAppMetadata = Reflect.getMetadata(DESIGN_META_DATA.APP, appClass);
                    serviceClasses = gotaAppMetadata.scanner;
                    config = gotaAppMetadata.config;
                    if (!serviceClasses) {
                        throw new Error('Please make sure "scanner" in "@GotaApp" Metadata of "' + appClass.name + '" is not empty.');
                    }
                    if (!Array.isArray(serviceClasses)) {
                        serviceClasses = [serviceClasses];
                    }
                    app = initApp();
                    serviceTargets = initConfig(serviceClasses, config);
                    return [4 /*yield*/, executePostInit(serviceTargets)];
                case 1:
                    _a.sent();
                    serviceTargets.forEach(function (serviceTarget) {
                        var serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceTarget.constructor);
                        var models = serviceMetaData.models;
                        Booter_1["default"].bootModels(app, serviceMetaData.path, models);
                        Booter_1["default"].bootService(app, serviceTarget);
                    });
                    app.listen(config.port, config.hostName, function () {
                        console.log((gotaAppMetadata.name || appClass.name) + " is listening at " + config.hostName + ":" + config.port);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.GotaBoot = GotaBoot;
