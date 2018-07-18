"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
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
let autowiredContext = {};
function Config(configKey) {
    return function (target, property) {
        if (!configKey) {
            configKey = property;
        }
        let getter = function () {
            let config = Reflect.getMetadata(DESIGN_META_DATA.CONFIG, target.constructor);
            if (!config) {
                console.log('\n' + `Config "${property}" of ${target.name} has not initiated.`);
                console.log(`Please check class ${target.name} and config into scanner App.` + '\n');
                return undefined;
            }
            let value = config[configKey];
            if (!value && configKey.indexOf('.') > -1) {
                let configKeys = configKey.split('.');
                value = config;
                for (let key of configKeys) {
                    value = value[key];
                    if (!value) {
                        break;
                    }
                }
            }
            return value;
        };
        let setter = function (newVal) {
            throw Error('Can not change config value');
        };
        if (delete target[property]) {
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
    let autowiredPropertyNames = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, target) || [];
    autowiredPropertyNames.push(property);
    Reflect.defineMetadata(DESIGN_META_DATA.AUTOWIRED, autowiredPropertyNames, target);
    let t = Reflect.getMetadata("design:typeinfo", target, property).type();
    let obj = autowiredContext[t.name];
    if (!(obj instanceof t)) {
        obj = new t();
        autowiredContext[t.name] = obj;
    }
    let getter = function () {
        return obj;
    };
    let setter = function (newVal) {
        throw Error('Can not change config value');
    };
    if (delete target[property]) {
        Object.defineProperty(target, property, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
exports.Autowired = Autowired;
//# sourceMappingURL=index.js.map