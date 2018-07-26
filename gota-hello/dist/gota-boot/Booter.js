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
const index_1 = require("../gota-dao/index");
const index_2 = require("../gota-helper/index");
const DESIGN_META_DATA = {
    APP: 'design:meta:data:key:app',
    CONFIG: 'design:meta:data:key:config',
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
class Booter {
    static buildServiceWrapper(service) {
        let serviceClass = service.constructor;
        let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        let functionWrappers = this.buildMethodWrappers(service);
        let serviceWrapper = {
            service: service,
            path: serviceMetaData.path,
            functionWrappers: functionWrappers
        };
        return serviceWrapper;
    }
    static buildMethodWrappers(service) {
        let methodWrappers = [];
        methodWrappers = Object.getOwnPropertyNames(service.constructor.prototype).filter(function (property) {
            return typeof service[property] === 'function' && service[property].toString().indexOf('class') !== 0;
        }).map(methodName => {
            return this.buildMethodWrapper(service, methodName);
        }).filter(methodWrapper => methodWrapper);
        return methodWrappers;
    }
    static buildMethodWrapper(service, methodName) {
        let methodMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE_MAPPING, service, methodName);
        if (methodMetaData) {
            let _function = service[methodName];
            let parameterWrappers = this.buildParameterWrappers(service, methodName);
            let functionWrapper;
            functionWrapper = {
                function: _function,
                requestMethod: methodMetaData.requestMethod || REQUEST_METHOD.GET,
                path: methodMetaData.path,
                returnType: methodMetaData.returnType,
                awaitedType: methodMetaData.awaitedType,
                parameterWrappers: parameterWrappers
            };
            return functionWrapper;
        }
        else {
            return undefined;
        }
    }
    static buildParameterWrappers(service, methodName) {
        let parameterWrappers = [];
        let parameterMetaData = Reflect.getMetadata(DESIGN_META_DATA.PARAMETER, service, methodName);
        if (Array.isArray(parameterMetaData)) {
            parameterMetaData.forEach(parameterItem => {
                let parameterWrapper = {
                    designMetaData: parameterItem.designMetaData,
                    name: parameterItem.name,
                    type: parameterItem.type
                };
                parameterWrappers.push(parameterWrapper);
            });
        }
        return parameterWrappers;
    }
    static getArguments(request, response, parameterWrappers) {
        let _arguments = [];
        if (Array.isArray(parameterWrappers) && parameterWrappers.length > 0) {
            parameterWrappers.forEach(parameterWrapper => {
                let designMetaData = parameterWrapper.designMetaData;
                let parameterName = parameterWrapper.name;
                switch (designMetaData) {
                    case DESIGN_META_DATA.PATH_PARAMETER:
                        _arguments.push(request.params[parameterName]);
                        break;
                    case DESIGN_META_DATA.QUERY:
                        _arguments.push(request.query);
                        break;
                    case DESIGN_META_DATA.QUERY_PARAMETER:
                        _arguments.push(request.query[parameterName]);
                        break;
                    case DESIGN_META_DATA.BODY:
                        _arguments.push(request.body);
                        break;
                    case DESIGN_META_DATA.BODY_PARAMETER:
                        _arguments.push(request.body[parameterName]);
                        break;
                    case DESIGN_META_DATA.HEADERS:
                        _arguments.push(request.headers);
                        break;
                    case DESIGN_META_DATA.HEADERS_PARAMETER:
                        let argLowerCase = parameterName.replace(/[A-Z]/g, (match, offset, string) => {
                            return (offset ? '-' : '') + match.toLowerCase();
                        });
                        _arguments.push(request.headers[parameterName] || request.headers[argLowerCase]);
                        break;
                    case DESIGN_META_DATA.REQUEST:
                        _arguments.push(request);
                        break;
                    case DESIGN_META_DATA.RESPONSE:
                        _arguments.push(response);
                    default:
                        break;
                }
            });
        }
        return _arguments;
    }
    static collectServiceInformation(serviceWrapper) {
        let serviceInformationList = [];
        let servicePaths = serviceWrapper.path;
        if (typeof servicePaths === 'string') {
            servicePaths = [servicePaths.toString()];
        }
        let functionWrappers = serviceWrapper.functionWrappers;
        servicePaths.forEach(servicePath => {
            functionWrappers.forEach(functionWrapper => {
                let requestMethods = functionWrapper.requestMethod;
                if (typeof requestMethods === 'string') {
                    requestMethods = [requestMethods.toString()];
                }
                requestMethods.forEach(requestMethod => {
                    let functionPaths = functionWrapper.path;
                    if (typeof functionPaths === 'string') {
                        functionPaths = [functionPaths.toString()];
                    }
                    functionPaths.forEach(functionPath => {
                        let path = servicePath + functionPath;
                        let serviceInformation = {
                            path: path,
                            requestMethod: requestMethod,
                            service: serviceWrapper.service,
                            function: functionWrapper.function,
                            returnType: functionWrapper.returnType,
                            awaitedType: functionWrapper.awaitedType,
                            requestInformation: functionWrapper.parameterWrappers
                        };
                        serviceInformationList.push(serviceInformation);
                    });
                });
            });
        });
        return serviceInformationList;
    }
    static bootAcollectionServiceItem(server, serviceInformation) {
        let app = server;
        let path = serviceInformation.path;
        let requestMethod = serviceInformation.requestMethod;
        let _function = serviceInformation.function;
        let service = serviceInformation.service;
        app.addMapping(path, requestMethod, serviceInformation.requestInformation, _function, service);
    }
    static bootCollectionService(server, collectionService) {
        collectionService.forEach(serviceInformation => {
            this.bootAcollectionServiceItem(server, serviceInformation);
        });
    }
    static collectOptionsServiceInformation(serviceInformationList) {
        let urls = serviceInformationList
            .map(item => item.path)
            .filter((item, pos, self) => self.indexOf(item) == pos);
        let collectionOptionService = {};
        urls.forEach(url => {
            let collectionOptionServiceItem = collectionOptionService[url] || {};
            let sameUrlServiceInformation = serviceInformationList.filter(item => item.path === url);
            sameUrlServiceInformation.forEach(serviceInformation => {
                collectionOptionServiceItem[serviceInformation.requestMethod] = {
                    service: serviceInformation.service,
                    function: serviceInformation.function,
                    returnType: serviceInformation.returnType,
                    awaitedType: serviceInformation.awaitedType,
                    requestInformation: serviceInformation.requestInformation
                };
            });
            collectionOptionService[url] = collectionOptionServiceItem;
        });
        return collectionOptionService;
    }
    static buildAOptionSummary(url, object) {
        let returnObject = { url: url };
        let schema = [];
        Object.keys(object).forEach(key => {
            let responseType = object[key]['awaitedType'] || object[key]['returnType'] || 'String';
            let requestData = {};
            object[key]['requestInformation'].forEach(item => {
                switch (item.designMetaData) {
                    case DESIGN_META_DATA.PATH_PARAMETER:
                        requestData.path = requestData.path || [];
                        requestData.path.push({ name: item.name, type: item.type.name });
                        break;
                    case DESIGN_META_DATA.HEADERS_PARAMETER:
                        requestData.headers = requestData.headers || [];
                        requestData.headers.push({ name: item.name, type: item.type.name });
                        break;
                    case DESIGN_META_DATA.QUERY_PARAMETER:
                        requestData.query = requestData.query || [];
                        requestData.query.push({ name: item.name, type: item.type.name });
                        break;
                    case DESIGN_META_DATA.BODY_PARAMETER:
                        requestData.body = requestData.body || [];
                        requestData.body.push({ name: item.name, type: item.type.name });
                        break;
                }
                let childSchema = index_2.default.collectSchema(item.type);
                if (childSchema.length > 0) {
                    schema.push(childSchema);
                }
            });
            let returnSchema = (typeof responseType === 'function') ? index_2.default.collectSchema(responseType) : index_2.default.collectSchema(responseType);
            returnObject[key] =
                {
                    requestData: requestData,
                    responseType: responseType.name || responseType,
                    schema
                };
        });
        return returnObject;
    }
    static bootSummaryService(server, path, optionServiceInformationList) {
        let summary = [];
        Object.keys(optionServiceInformationList).forEach(key => {
            summary.push(Booter.buildAOptionSummary(key, optionServiceInformationList[key]));
        });
        summary.forEach(s => {
            server.addMapping(s.url, REQUEST_METHOD.OPTIONS, [], () => s, null);
        });
    }
    static bootService(server, service) {
        let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, service.constructor);
        let models = serviceMetaData.models;
        let modelServiceInformationList = Booter.collectModelsServiceInformation(serviceMetaData.path, models);
        let serviceWrapper = Booter.buildServiceWrapper(service);
        let serviceInformationList = Booter.collectServiceInformation(serviceWrapper);
        serviceInformationList.push(...modelServiceInformationList);
        let optionServiceInformationList = Booter.collectOptionsServiceInformation(serviceInformationList);
        Booter.bootCollectionService(server, serviceInformationList);
        Booter.bootSummaryService(server, serviceWrapper.path, optionServiceInformationList);
    }
    static collectModelsServiceInformation(servicePath, models = []) {
        let serviceInformation = [];
        models.forEach(model => {
            let service = Booter.collectAModelServiceInformation(servicePath, model);
            serviceInformation.push(...service);
        });
        return serviceInformation;
    }
    static collectAModelServiceInformation(servicePath, model) {
        let dao = new index_1.DAO(model);
        dao.initCollection();
        let modelPath = model.name.replace(/[A-Z]/g, (match, offset, string) => {
            return (offset ? '-' : '') + match.toLowerCase();
        });
        let declaredProperties = index_2.default.findDeclaredProperties(model).filter(property => property.name !== '_id');
        let bodyParameter = {
            designMetaData: DESIGN_META_DATA.BODY,
            name: 'body',
            type: model
        };
        let bodyParameters = declaredProperties
            .map(item => {
            return {
                designMetaData: DESIGN_META_DATA.BODY_PARAMETER,
                name: item.name,
                type: item.type
            };
        });
        let idPathParameter = {
            designMetaData: DESIGN_META_DATA.PATH_PARAMETER,
            name: 'id',
            type: String
        };
        let queryParameter = {
            designMetaData: DESIGN_META_DATA.QUERY,
            name: 'query',
            type: model
        };
        let queryParameters = declaredProperties
            .map(item => {
            return {
                designMetaData: DESIGN_META_DATA.QUERY_PARAMETER,
                name: item.name,
                type: item.type
            };
        });
        let unUnitName = function (str) {
            var re = new RegExp(/./g);
            str = str.toLowerCase();
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            str = str.replace(/a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, '(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)');
            str = str.replace(/e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, '(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)');
            str = str.replace(/i|ì|í|ị|ỉ|ĩ/g, '(i|ì|í|ị|ỉ|ĩ)');
            str = str.replace(/o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, '(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)');
            str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, '(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)');
            str = str.replace(/y|ỳ|ý|ỵ|ỷ|ỹ/g, '(y|ỳ|ý|ỵ|ỷ|ỹ)');
            str = str.replace(/d|đ/g, '(d|đ)');
            str = str.trim();
            str = str.replace(/ +/g, "(.*)");
            return str;
        };
        let executes = {
            search: function (query) {
                return __awaiter(this, void 0, void 0, function* () {
                    Object.keys(query).forEach(key => {
                        if (query[key].startsWith('$regex:')) {
                            let regexValue = query[key].substring('$regex:'.length).trim();
                            regexValue = unUnitName(regexValue);
                            query[key] = {
                                $regex: new RegExp(regexValue, 'i')
                            };
                        }
                    });
                    let t = yield dao.search(query);
                    return t;
                });
            },
            read: function (id) {
                return __awaiter(this, void 0, void 0, function* () {
                    let t = yield dao.read(id);
                    return t;
                });
            },
            create: function (body) {
                return __awaiter(this, void 0, void 0, function* () {
                    let _id;
                    if (Array.isArray(body)) {
                        _id = yield dao.createMany(body);
                    }
                    else {
                        _id = yield dao.create(body);
                    }
                    return { _id: _id };
                });
            },
            update: function (id, body) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield dao.update(id, body);
                    return { result: result };
                });
            },
            updateMany: function (query, body) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield dao.updateMany(query, body);
                    return { result: result };
                });
            },
            delete: function (id) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield dao.delete(id);
                    return { result: result };
                });
            },
            createChild: function (id, query, body) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result;
                    if (query && Object.keys(query).find(key => query[key] == '$')) {
                        let childProperty = Object.keys(query).find(key => query[key] == '$');
                        result = yield dao.createChild(id, childProperty, body);
                    }
                    return { result: result };
                });
            },
            updateChild: function (id, query, body) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result;
                    if (query && Object.keys(query).find(key => query[key] == '$')) {
                        let childProperty = Object.keys(query).find(key => query[key] == '$');
                        let childQuery = Object.assign(query);
                        childQuery[childProperty] = undefined;
                        result = yield dao.updateChild(id, childProperty, childQuery, body);
                    }
                    return { result: result };
                });
            }
        };
        let search = {
            requestMethod: REQUEST_METHOD.GET,
            path: `${servicePath}/${modelPath}`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [...queryParameters],
            service: null,
            function: executes.search
        };
        let create = {
            requestMethod: REQUEST_METHOD.POST,
            path: `${servicePath}/${modelPath}`,
            returnType: Promise,
            awaitedType: model.name,
            requestInformation: [...bodyParameters],
            service: null,
            function: executes.create
        };
        let update = {
            requestMethod: REQUEST_METHOD.PATCH,
            path: `${servicePath}/${modelPath}/:id`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [idPathParameter, ...bodyParameters],
            service: null,
            function: executes.update
        };
        let updateMany = {
            requestMethod: REQUEST_METHOD.PATCH,
            path: `${servicePath}/${modelPath}`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [...queryParameters, ...bodyParameters],
            service: null,
            function: executes.updateMany
        };
        let read = {
            requestMethod: REQUEST_METHOD.GET,
            path: `${servicePath}/${modelPath}/:id`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [idPathParameter],
            service: null,
            function: executes.read
        };
        let createChild = {
            requestMethod: REQUEST_METHOD.POST,
            path: `${servicePath}/${modelPath}/:id`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [idPathParameter, queryParameter, bodyParameter],
            service: null,
            function: executes.createChild
        };
        let updateChild = {
            requestMethod: REQUEST_METHOD.PATCH,
            path: `${servicePath}/${modelPath}/:id`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [idPathParameter, queryParameter, bodyParameter],
            service: null,
            function: executes.update
        };
        let _delete = {
            requestMethod: REQUEST_METHOD.DELETE,
            path: `${servicePath}/${modelPath}/:id`,
            returnType: Promise,
            awaitedType: `Array<${model.name}>`,
            requestInformation: [idPathParameter],
            service: null,
            function: executes.delete
        };
        return [search, create, updateMany, read, createChild, update, _delete];
    }
}
exports.default = Booter;
//# sourceMappingURL=Booter.js.map