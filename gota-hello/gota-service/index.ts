
//https://rbuckton.github.io/reflect-metadata/#syntax
import 'reflect-metadata'
import {Helper} from "../gota-core/index";

const DESIGN_META_DATA = {
    APP : 'design:meta:data:key:app',
    CONFIG : 'design:meta:data:key:config',
    POST_INIT : 'design:meta:data:key:post.init',
    AUTOWIRED : 'design:meta:data:key:autowired',
    SERVICE : 'design:meta:data:key:service',
    SERVICE_MAPPING : 'design:meta:data:key:service:mapping',
    PATH : 'design:meta:data:key:path',
    METHOD : 'design:meta:data:key:method',
    PARAMETER : 'design:meta:data:key:parameter',
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
export class RequestMethod{
    static OPTIONS = 'OPTIONS';
    static GET  =  'GET';
    static  POST  = 'POST';
    static  PUT  = 'PUT';
    static  PATCH  = 'PATCH';
    static  DELETE = 'DELETE';
}


export function Service(mapping:{ name?: string, path: string | Array<string>, config?:object, models?: Array<any>}) {
	return function(... args : any[]): void {
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

        let serviceWrapper = Object.assign({name: args[0].name}, mapping);
	    Reflect.defineMetadata(DESIGN_META_DATA.SERVICE, serviceWrapper, args[0]);
	}
}
/* move to injection
export function Config(configKey?:string) {
    return function(target: any, property: string): void {
        if(!configKey){
            configKey = property;
        }

        // property value
        // var _val = target[property];

        // property getter
        let getter = function () {
            let config  = Reflect.getMetadata(DESIGN_META_DATA.CONFIG, target.constructor);
            if(!config){
				console.log('\n'+`Config "${property}" of ${target.name} has not initiated.`);
				console.log(`Please check class ${target.name} and config into scanner App.`+'\n');
				return undefined;
			}
			let value = config[configKey as string];
			if(!value && (configKey as string).indexOf('.') > -1){
				let configKeys = (configKey as string).split('.');
				value = config;
				for(let key of configKeys) {
					value = value[key];
					if(!value){
						break;
					}
				}
			}
			return value;
        };

        // property setter
        let setter = function (newVal:any) {
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
}
*/
/* move to injection
export function Autowired(target : any, property : string) {
    let autowiredPropertyNames: Array<Object> = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, target) || [];
    autowiredPropertyNames.push(property);
    Reflect.defineMetadata(DESIGN_META_DATA.AUTOWIRED, autowiredPropertyNames, target);

    let t: any = Reflect.getMetadata("design:typeinfo", target, property).type();
    let obj = beanContext[t.name];
    if(!(obj instanceof t)){
        obj = new t();
        beanContext[t.name] = obj;
    }

    let getter = function () {
        return obj;
    };
    // property setter
    let setter = function (newVal: any) {
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

*/

// move to gota core
// export function PostInit(target : any, methodName : string) {
//     let postInitMethodNames: Array<Object> = Reflect.getMetadata(DESIGN_META_DATA.POST_INIT, target) || [];
//     postInitMethodNames.push(methodName);
//     Reflect.defineMetadata(DESIGN_META_DATA.POST_INIT, postInitMethodNames, target);
// }

export function ServiceMapping(mapping:{name?: string, path : string | Array<string>, requestMethod?: string | Array<string>} ) {
    return function(... args : any[]): void {
        let typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
        if (!typeInfo.returnType){
			throw new Error('Missing returnType of Method ' +args[0].constructor.name+'.'+ args[1]);
		} else if(typeInfo.returnType === Promise && !typeInfo.awaitedType){
			throw new Error('Missing awaitedType of Method ' +args[0].constructor.name+'.'+ args[1]);
		}
		let functionWrapper: Object = {
            path: mapping.path,
            requestMethod: mapping.requestMethod,
            returnType:typeInfo.returnType,
            awaitedType: typeInfo.awaitedType
        };
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper, args[0], args[1]);
    }




    //return Reflect.metadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper);
}
// move to gota core
// export function AwaitedType(clazz:Function|string) {
//     return function(... args : any[]): void {
//         let typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
//         typeInfo.awaitedType = clazz;
//         Reflect.defineMetadata("design:typeinfo", typeInfo, args[0], args[1]);
//     }
//
//
//
//
//     //return Reflect.metadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper);
// }

//https://blogs.msdn.microsoft.com/typescript/2015/04/30/announcing-typescript-1-5-beta/
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//https://www.typescriptlang.org/docs/handbook/decorators.html#metadata
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4

function Parameter(designMetaData: string, target: any, methodName: string | symbol, index: number) {
    let paramType: any = Reflect.getMetadata("design:typeinfo", target, methodName).paramTypes()[index];
    let method: Function = target[methodName];
    let paramName:string = Helper.getArguments(method)[index];
    let parameterWrapper: Object = {
        designMetaData: designMetaData,
        name: paramName,
        type: paramType
    };
    let parameterWrappers: Array<Object> = Reflect.getOwnMetadata(DESIGN_META_DATA.PARAMETER, target, methodName) || [];
    parameterWrappers[index] = parameterWrapper;
    Reflect.defineMetadata(DESIGN_META_DATA.PARAMETER, parameterWrappers, target, methodName);
}

export function PathParameter(target: Object, name: string | symbol, index: number) {
    /*
    let indexes: number[] = Reflect.getOwnMetadata(DESIGN_PATH_PARAMETER_STRING, target, name) || [];
    indexes.push(index);
    Reflect.defineMetadata(DESIGN_PATH_PARAMETER_STRING, indexes, target, name);
    */
    Parameter(DESIGN_META_DATA.PATH_PARAMETER, target, name, index);
}

export function Query(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.QUERY, target, name, index);
}

export function QueryParameter(target: any, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.QUERY_PARAMETER, target, name, index);
}

export function Body(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.BODY, target, name, index);
}

export function BodyParameter(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.BODY_PARAMETER, target, name, index);
}


export function Headers(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.HEADERS, target, name, index);
}

export function HeadersParameter(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.HEADERS_PARAMETER, target, name, index);
}

export function Request(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.REQUEST, target, name, index);
}

export function Response(target: Object, name: string | symbol, index: number) {
    Parameter(DESIGN_META_DATA.RESPONSE, target, name, index);
}




// Metadata introspection
/*
let obj = new C("a", 1);
let paramTypes = Reflect.getMetadata("design:method", obj, "add");
console.log(paramTypes);
    */