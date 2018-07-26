
//https://rbuckton.github.io/reflect-metadata/#syntax
import 'reflect-metadata'
import Helper from "../gota-helper/index";

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
    HEADERS_PARAMETER : 'design:meta:data:key:headers:parameter',
    ENTITY : 'design:meta:data:key:entity'
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


export function Entity(properties?: Array<{name:string, type: Function}>){
	return function(... args : any[]): void {
        let clazz = Helper.findSuper(args[0]);
        let propertiesPlus =  [... Helper.findDeclaredProperties(clazz), ... properties];
	    Reflect.defineMetadata(DESIGN_META_DATA.ENTITY, propertiesPlus, args[0]);
	}
}

export function Field(){
    return function(... args : any[]): void {
        let clazz = Helper.findSuper(args[0]);
        let propertiesPlus =  [... Helper.findDeclaredProperties(clazz), ... properties];
        Reflect.defineMetadata(DESIGN_META_DATA.ENTITY, propertiesPlus, args[0]);
    }
}
