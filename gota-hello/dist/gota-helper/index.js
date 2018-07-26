"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    HEADERS_PARAMETER: 'design:meta:data:key:headers:parameter',
    ENTITY: 'design:meta:data:key:entity'
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
function getArguments(func) {
    let functionName = func.toString();
    var args = ('function ' + functionName).match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
}
function findSuper(child) {
    let _super = Object.getPrototypeOf(child.prototype).constructor;
    return _super;
}
function findDeclaredProperties(clazz) {
    let _clazz = clazz;
    let properties = [];
    while (Reflect.getOwnMetadata(DESIGN_META_DATA.ENTITY, _clazz)) {
        properties = [...Reflect.getOwnMetadata(DESIGN_META_DATA.ENTITY, _clazz), ...properties];
        _clazz = Helper.findSuper(_clazz);
    }
    return properties;
}
function collectSchema(clazz) {
    let _clazz = clazz;
    let schema = [];
    let declaredProperties = Helper.findDeclaredProperties(_clazz);
    let properties;
    if (declaredProperties.length > 0) {
        properties = declaredProperties.map(property => {
            let childSchema = Helper.collectSchema(property.type);
            if (childSchema.length > 0) {
                schema.push(...childSchema);
            }
            return { name: property.name, type: property.type.name };
        });
        schema.push({ name: clazz.name, properties: properties });
        schema = schema.filter((item, index, target) => target.indexOf(item) === index);
    }
    return schema;
}
class Helper {
}
Helper.getArguments = getArguments;
Helper.findSuper = findSuper;
Helper.findDeclaredProperties = findDeclaredProperties;
Helper.collectSchema = collectSchema;
exports.default = Helper;
//# sourceMappingURL=index.js.map