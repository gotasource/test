"use strict";
exports.__esModule = true;
//https://rbuckton.github.io/reflect-metadata/#syntax
require("reflect-metadata");
var index_1 = require("../gota-helper/index");
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
var RequestMethod = /** @class */ (function () {
    function RequestMethod() {
    }
    RequestMethod.OPTIONS = 'OPTIONS';
    RequestMethod.GET = 'GET';
    RequestMethod.POST = 'POST';
    RequestMethod.PUT = 'PUT';
    RequestMethod.PATCH = 'PATCH';
    RequestMethod.DELETE = 'DELETE';
    return RequestMethod;
}());
exports.RequestMethod = RequestMethod;
var autowiredContext = {};
function Service(mapping) {
    return function () {
        // let serviceName = mapping.name;
        // if(!serviceName){
        //     serviceName = args[0].name;
        // }
        // let serviceWrapper = {
        //    name: serviceName,
        //     path: mapping.path,
        //     config: mapping.config
        //
        // };
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var serviceWrapper = Object.assign({ name: args[0].name }, mapping);
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE, serviceWrapper, args[0]);
    };
}
exports.Service = Service;
function Config(configKey) {
    return function (target, property) {
        if (!configKey) {
            configKey = property;
        }
        // property value
        // var _val = target[property];
        // property getter
        var getter = function () {
            var config = Reflect.getMetadata(DESIGN_META_DATA.CONFIG, target.constructor);
            if (!config) {
                console.log('\n' + ("Config \"" + property + "\" of " + target.name + " has not initiated."));
                console.log("Please check class " + target.name + " and config into scanner App." + '\n');
                return undefined;
            }
            var value = config[configKey];
            if (!value && configKey.indexOf('.') > -1) {
                var configKeys = configKey.split('.');
                value = config;
                for (var _i = 0, configKeys_1 = configKeys; _i < configKeys_1.length; _i++) {
                    var key = configKeys_1[_i];
                    value = value[key];
                    if (!value) {
                        break;
                    }
                }
            }
            return value;
        };
        // property setter
        var setter = function (newVal) {
            throw Error('Can not change config value');
        };
        // Delete property.
        if (delete target[property]) {
            // Create new property with getter and setter
            Object.defineProperty(target, property, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
exports.Config = Config;
function Autowired(target, property) {
    var autowiredPropertyNames = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, target) || [];
    autowiredPropertyNames.push(property);
    Reflect.defineMetadata(DESIGN_META_DATA.AUTOWIRED, autowiredPropertyNames, target);
    autowiredContext;
    var t = Reflect.getMetadata("design:typeinfo", target, property).type();
    var obj = autowiredContext[t.name];
    if (!(obj instanceof t)) {
        obj = new t();
        autowiredContext[t.name] = obj;
    }
    var getter = function () {
        return obj;
    };
    // property setter
    var setter = function (newVal) {
        throw Error('Can not change config value');
    };
    // Delete property.
    if (delete target[property]) {
        // Create new property with getter and setter
        Object.defineProperty(target, property, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
exports.Autowired = Autowired;
function PostInit(target, methodName) {
    var postInitMethodNames = Reflect.getMetadata(DESIGN_META_DATA.POST_INIT, target) || [];
    postInitMethodNames.push(methodName);
    Reflect.defineMetadata(DESIGN_META_DATA.POST_INIT, postInitMethodNames, target);
}
exports.PostInit = PostInit;
function ServiceMapping(mapping) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
        if (!typeInfo.returnType) {
            throw new Error('Missing returnType of Method ' + args[0].constructor.name + '.' + args[1]);
        }
        else if (typeInfo.returnType === Promise && !typeInfo.awaitedType) {
            throw new Error('Missing awaitedType of Method ' + args[0].constructor.name + '.' + args[1]);
        }
        var functionWrapper = {
            path: mapping.path,
            requestMethod: mapping.requestMethod,
            returnType: typeInfo.returnType,
            awaitedType: typeInfo.awaitedType
        };
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper, args[0], args[1]);
    };
    //return Reflect.metadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper);
}
exports.ServiceMapping = ServiceMapping;
//https://blogs.msdn.microsoft.com/typescript/2015/04/30/announcing-typescript-1-5-beta/
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//https://www.typescriptlang.org/docs/handbook/decorators.html#metadata
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4
function Parameter(designMetaData, target, methodName, index) {
    var paramType = Reflect.getMetadata("design:typeinfo", target, methodName).paramTypes()[index];
    var method = target[methodName];
    var paramName = index_1["default"].getArguments(method)[index];
    var parameterWrapper = {
        designMetaData: designMetaData,
        name: paramName,
        type: paramType
    };
    var parameterWrappers = Reflect.getOwnMetadata(DESIGN_META_DATA.PARAMETER, target, methodName) || [];
    parameterWrappers[index] = parameterWrapper;
    Reflect.defineMetadata(DESIGN_META_DATA.PARAMETER, parameterWrappers, target, methodName);
}
function PathParameter(target, name, index) {
    /*
    let indexes: number[] = Reflect.getOwnMetadata(DESIGN_PATH_PARAMETER_STRING, target, name) || [];
    indexes.push(index);
    Reflect.defineMetadata(DESIGN_PATH_PARAMETER_STRING, indexes, target, name);
    */
    Parameter(DESIGN_META_DATA.PATH_PARAMETER, target, name, index);
}
exports.PathParameter = PathParameter;
function Query(target, name, index) {
    Parameter(DESIGN_META_DATA.QUERY, target, name, index);
}
exports.Query = Query;
function QueryParameter(target, name, index) {
    Parameter(DESIGN_META_DATA.QUERY_PARAMETER, target, name, index);
}
exports.QueryParameter = QueryParameter;
function Body(target, name, index) {
    Parameter(DESIGN_META_DATA.BODY, target, name, index);
}
exports.Body = Body;
function BodyParameter(target, name, index) {
    Parameter(DESIGN_META_DATA.BODY_PARAMETER, target, name, index);
}
exports.BodyParameter = BodyParameter;
function Headers(target, name, index) {
    Parameter(DESIGN_META_DATA.HEADERS, target, name, index);
}
exports.Headers = Headers;
function HeadersParameter(target, name, index) {
    Parameter(DESIGN_META_DATA.HEADERS_PARAMETER, target, name, index);
}
exports.HeadersParameter = HeadersParameter;
function Request(target, name, index) {
    Parameter(DESIGN_META_DATA.REQUEST, target, name, index);
}
exports.Request = Request;
function Response(target, name, index) {
    Parameter(DESIGN_META_DATA.RESPONSE, target, name, index);
}
exports.Response = Response;
// Metadata introspection
/*
let obj = new C("a", 1);
let paramTypes = Reflect.getMetadata("design:method", obj, "add");
console.log(paramTypes);
    */ 
