
//https://rbuckton.github.io/reflect-metadata/#syntax
import "reflect-metadata";

const DESIGN_META_DATA = {
    SERVICE : 'design:meta:data:key:service',
    PATH : 'design:meta:data:key:path',
    METHOD : 'design:meta:data:key:method',
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
    GET :'get',
    POST :'post',//create
    PUT :'put',// replace
    PATCH : 'patch',// update
    DELETE : 'delete'
};
export class RequestMethod{
    static GET  =  'get';
    static  POST  = 'post';
    static  PUT  = 'put';
    static  PATCH  = 'patch';
    static  DELETE = 'delete';
}
export function Path(path:string | Array<string>) {
	return function(...args : any[]): void {
		Reflect.defineMetadata(DESIGN_META_DATA.PATH, path, ...args);
	}
}

export function Method(method:string | Array<string>) {
    return Reflect.metadata(DESIGN_META_DATA.METHOD, method);
}

//https://blogs.msdn.microsoft.com/typescript/2015/04/30/announcing-typescript-1-5-beta/
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//https://www.typescriptlang.org/docs/handbook/decorators.html#metadata
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4

function Parameter(designParameter: string, targetClass: Object, methodName: string | symbol, index: number) {
    let indexes: number[] = Reflect.getOwnMetadata(designParameter, targetClass, methodName) || [];
    indexes.push(index);
    Reflect.defineMetadata(designParameter, indexes, targetClass, methodName);
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

export function QueryParameter(target: Object, name: string | symbol, index: number) {
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