"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const index_1 = require("../gota-helper/index");
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
class RequestMethod {
}
RequestMethod.OPTIONS = 'OPTIONS';
RequestMethod.GET = 'GET';
RequestMethod.POST = 'POST';
RequestMethod.PUT = 'PUT';
RequestMethod.PATCH = 'PATCH';
RequestMethod.DELETE = 'DELETE';
exports.RequestMethod = RequestMethod;
let autowiredContext = {};
function Service(mapping) {
    return function (...args) {
        let serviceWrapper = Object.assign({ name: args[0].name }, mapping);
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE, serviceWrapper, args[0]);
    };
}
exports.Service = Service;
function ServiceMapping(mapping) {
    return function (...args) {
        let typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
        if (!typeInfo.returnType) {
            throw new Error('Missing returnType of Method ' + args[0].constructor.name + '.' + args[1]);
        }
        else if (typeInfo.returnType === Promise && !typeInfo.awaitedType) {
            throw new Error('Missing awaitedType of Method ' + args[0].constructor.name + '.' + args[1]);
        }
        let functionWrapper = {
            path: mapping.path,
            requestMethod: mapping.requestMethod,
            returnType: typeInfo.returnType,
            awaitedType: typeInfo.awaitedType
        };
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper, args[0], args[1]);
    };
}
exports.ServiceMapping = ServiceMapping;
function Parameter(designMetaData, target, methodName, index) {
    let paramType = Reflect.getMetadata("design:typeinfo", target, methodName).paramTypes()[index];
    let method = target[methodName];
    let paramName = index_1.default.getArguments(method)[index];
    let parameterWrapper = {
        designMetaData: designMetaData,
        name: paramName,
        type: paramType
    };
    let parameterWrappers = Reflect.getOwnMetadata(DESIGN_META_DATA.PARAMETER, target, methodName) || [];
    parameterWrappers[index] = parameterWrapper;
    Reflect.defineMetadata(DESIGN_META_DATA.PARAMETER, parameterWrappers, target, methodName);
}
function PathParameter(target, name, index) {
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
//# sourceMappingURL=index.js.map