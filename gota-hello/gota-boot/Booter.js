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
var DAO_1 = require("../data-access/DAO");
var DESIGN_META_DATA = {
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
var REQUEST_METHOD = {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};
var Booter = /** @class */ (function () {
    function Booter() {
    }
    Booter.buildServiceWrapper = function (service) {
        var serviceClass = service.constructor;
        var serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        var functionWrappers = this.buildMethodWrappers(service);
        var serviceWrapper = {
            service: service,
            path: serviceMetaData.path,
            functionWrappers: functionWrappers
        };
        return serviceWrapper;
    };
    Booter.buildMethodWrappers = function (service) {
        var _this = this;
        var methodWrappers = [];
        methodWrappers = Object.getOwnPropertyNames(service.constructor.prototype).filter(function (property) {
            return typeof service[property] === 'function' && service[property].toString().indexOf('class') !== 0;
        }).map(function (methodName) {
            return _this.buildMethodWrapper(service, methodName);
        }).filter(function (methodWrapper) { return methodWrapper; });
        return methodWrappers;
    };
    Booter.buildMethodWrapper = function (service, methodName) {
        var methodMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE_MAPPING, service, methodName);
        if (methodMetaData) {
            var _function = service[methodName];
            var parameterWrappers = this.buildParameterWrappers(service, methodName);
            var functionWrapper = void 0;
            functionWrapper = {
                "function": _function,
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
    };
    Booter.buildParameterWrappers = function (service, methodName) {
        var parameterWrappers = [];
        var parameterMetaData = Reflect.getMetadata(DESIGN_META_DATA.PARAMETER, service, methodName);
        if (Array.isArray(parameterMetaData)) {
            parameterMetaData.forEach(function (parameterItem) {
                var parameterWrapper = {
                    designMetaData: parameterItem.designMetaData,
                    name: parameterItem.name,
                    type: parameterItem.type
                };
                parameterWrappers.push(parameterWrapper);
            });
        }
        return parameterWrappers;
    };
    Booter.getArguments = function (request, response, parameterWrappers) {
        var _arguments = [];
        if (Array.isArray(parameterWrappers) && parameterWrappers.length > 0) {
            parameterWrappers.forEach(function (parameterWrapper) {
                var designMetaData = parameterWrapper.designMetaData;
                var parameterName = parameterWrapper.name;
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
                        var argLowerCase = parameterName.replace(/[A-Z]/g, function (match, offset, string) {
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
    };
    Booter.collectServiceInformation = function (serviceWrapper) {
        var serviceInformationList = [];
        var servicePaths = serviceWrapper.path;
        if (typeof servicePaths === 'string') {
            servicePaths = [servicePaths.toString()];
        }
        var functionWrappers = serviceWrapper.functionWrappers;
        servicePaths.forEach(function (servicePath) {
            functionWrappers.forEach(function (functionWrapper) {
                var requestMethods = functionWrapper.requestMethod;
                if (typeof requestMethods === 'string') {
                    requestMethods = [requestMethods.toString()];
                }
                requestMethods.forEach(function (requestMethod) {
                    var functionPaths = functionWrapper.path;
                    if (typeof functionPaths === 'string') {
                        functionPaths = [functionPaths.toString()];
                    }
                    functionPaths.forEach(function (functionPath) {
                        var path = servicePath + functionPath;
                        var serviceInformation = {
                            path: path,
                            requestMethod: requestMethod,
                            service: serviceWrapper.service,
                            "function": functionWrapper["function"],
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
    };
    Booter.bootAcollectionServiceItem = function (server, serviceInformation) {
        var app = server;
        var path = serviceInformation.path;
        var requestMethod = serviceInformation.requestMethod;
        var _function = serviceInformation["function"];
        var service = serviceInformation.service;
        app.addMapping(path, requestMethod, serviceInformation.requestInformation, _function, service);
    };
    Booter.bootCollectionService = function (server, collectionService) {
        var _this = this;
        collectionService.forEach(function (serviceInformation) {
            var config = Reflect.getMetadata(DESIGN_META_DATA.CONFIG, serviceInformation.service.constructor);
            // if(config.devMode){
            //     console.log('Apply method "%s" for url: "%s"', serviceInformation.requestMethod, serviceInformation.path);
            // }
            _this.bootAcollectionServiceItem(server, serviceInformation);
        });
    };
    /////////////////////////////
    Booter.collectOptionsServiceInformation = function (serviceInformationList) {
        var urls = serviceInformationList
            .map(function (item) { return item.path; })
            .filter(function (item, pos, self) { return self.indexOf(item) == pos; });
        var collectionOptionService = {};
        urls.forEach(function (url) {
            var collectionOptionServiceItem = collectionOptionService[url] || {};
            var sameUrlServiceInformation = serviceInformationList.filter(function (item) { return item.path === url; });
            sameUrlServiceInformation.forEach(function (serviceInformation) {
                collectionOptionServiceItem[serviceInformation.requestMethod] = {
                    service: serviceInformation.service,
                    "function": serviceInformation["function"],
                    returnType: serviceInformation.returnType,
                    awaitedType: serviceInformation.awaitedType,
                    requestInformation: serviceInformation.requestInformation
                };
            });
            collectionOptionService[url] = collectionOptionServiceItem;
        });
        return collectionOptionService;
    };
    Booter.buildAOptionSummary = function (url, object) {
        var returnObject = { url: url };
        Object.keys(object).forEach(function (key) {
            var responseType = object[key]['awaitedType'] || object[key]['returnType'] || function () { return String; };
            var requestData = {};
            object[key]['requestInformation'].forEach(function (item) {
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
            });
            returnObject[key] =
                {
                    requestData: requestData,
                    responseType: responseType().name
                };
        });
        return returnObject;
    };
    Booter.bootSummaryService = function (server, path, optionServiceInformationList) {
        var summary = [];
        Object.keys(optionServiceInformationList).forEach(function (key) {
            summary.push(Booter.buildAOptionSummary(key, optionServiceInformationList[key]));
        });
        summary.forEach(function (s) {
            server.addMapping(s.url, REQUEST_METHOD.OPTIONS, [], function () { return s; }, null);
        });
    };
    /////////////////////////////
    Booter.bootService = function (server, service) {
        var serviceWrapper = Booter.buildServiceWrapper(service);
        var serviceInformationList = Booter.collectServiceInformation(serviceWrapper);
        var optionServiceInformationList = Booter.collectOptionsServiceInformation(serviceInformationList);
        Booter.bootCollectionService(server, serviceInformationList);
        Booter.bootSummaryService(server, serviceWrapper.path, optionServiceInformationList);
    };
    Booter.bootModels = function (server, servicePath, models) {
        models.forEach(function (model) {
            Booter.bootAModel(server, servicePath, model);
        });
    };
    Booter.bootAModel = function (server, servicePath, model) {
        var dao = new DAO_1.DAO(model);
        dao.initCollection();
        var modelPath = model.name.replace(/[A-Z]/g, function (match, offset, string) {
            return (offset ? '-' : '') + match.toLowerCase();
        });
        var bodyParameter = {
            designMetaData: DESIGN_META_DATA.BODY,
            name: 'body',
            type: Object
        };
        var idPathParameter = {
            designMetaData: DESIGN_META_DATA.PATH_PARAMETER,
            name: 'id',
            type: String
        };
        var queryParameter = {
            designMetaData: DESIGN_META_DATA.QUERY,
            name: 'query',
            type: Object
        };
        var unUnitName = function (str) {
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
        var executes = {
            search: function (query) {
                return __awaiter(this, void 0, void 0, function () {
                    var t;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                Object.keys(query).forEach(function (key) {
                                    if (query[key].startsWith('$regex:')) {
                                        var regexValue = query[key].substring('$regex:'.length).trim();
                                        regexValue = unUnitName(regexValue);
                                        query[key] = {
                                            $regex: new RegExp(regexValue, 'i')
                                        };
                                    }
                                });
                                return [4 /*yield*/, dao.search(query)];
                            case 1:
                                t = _a.sent();
                                return [2 /*return*/, t];
                        }
                    });
                });
            },
            read: function (id) {
                return __awaiter(this, void 0, void 0, function () {
                    var t;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dao.read(id)];
                            case 1:
                                t = _a.sent();
                                return [2 /*return*/, t];
                        }
                    });
                });
            },
            create: function (body) {
                return __awaiter(this, void 0, void 0, function () {
                    var _id;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dao.create(body)];
                            case 1:
                                _id = _a.sent();
                                //}
                                return [2 /*return*/, { _id: _id }];
                        }
                    });
                });
            },
            createChild: function (id, query, body) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, childProperty;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(query && Object.keys(query).find(function (key) { return query[key] == '$'; }))) return [3 /*break*/, 2];
                                childProperty = Object.keys(query).find(function (key) { return query[key] == '$'; });
                                return [4 /*yield*/, dao.createChild(id, childProperty, body)];
                            case 1:
                                result = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, { result: result }];
                        }
                    });
                });
            },
            update: function (id, query, body) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, childProperty, childQuery;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(query && Object.keys(query).find(function (key) { return query[key] == '$'; }))) return [3 /*break*/, 2];
                                childProperty = Object.keys(query).find(function (key) { return query[key] == '$'; });
                                childQuery = Object.assign(query);
                                childQuery[childProperty] = undefined;
                                return [4 /*yield*/, dao.updateChild(id, childProperty, childQuery, body)];
                            case 1:
                                result = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, dao.update(id, body)];
                            case 3:
                                result = _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, { result: result }];
                        }
                    });
                });
            },
            "delete": function (id, body) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dao["delete"](id)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, { result: result }];
                        }
                    });
                });
            },
            options: function () { return { ok: 1 }; },
            updateMany: function (query, body) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dao.updateMany(query, body)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, { result: result }];
                        }
                    });
                });
            }
        };
        server.addMapping(servicePath + "/" + modelPath, REQUEST_METHOD.OPTIONS, [], executes.options);
        server.addMapping(servicePath + "/" + modelPath, REQUEST_METHOD.GET, [queryParameter], executes.search);
        server.addMapping(servicePath + "/" + modelPath, REQUEST_METHOD.POST, [bodyParameter], executes.create);
        //update many
        server.addMapping(servicePath + "/" + modelPath, REQUEST_METHOD.PATCH, [queryParameter, bodyParameter], executes.updateMany);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.OPTIONS, [], executes.options);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.GET, [idPathParameter], executes.read);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.POST, [idPathParameter, queryParameter, bodyParameter], executes.createChild);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.PUT, [idPathParameter, queryParameter, bodyParameter], executes.update);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.PATCH, [idPathParameter, queryParameter, bodyParameter], executes.update);
        server.addMapping(servicePath + "/" + modelPath + "/:id", REQUEST_METHOD.DELETE, [idPathParameter], executes["delete"]);
    };
    return Booter;
}());
exports["default"] = Booter;
