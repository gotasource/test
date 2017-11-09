
//https://rbuckton.github.io/reflect-metadata/#syntax
import "reflect-metadata";

const DESIGN_META_DATA = {
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

//https://davidwalsh.name/javascript-arguments
function getArguments(func:Function): Array<string> {
    let functionName = 'function '+func.toString();
    // First match everything inside the function argument parens.
    var args = ('function '+ functionName).match(/function\s.*?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}

export function Service(mapping:{ path:string | Array<string>}) {
	return function(... args : any[]): void {
        let serviceWrapper: Object = {
            path: mapping.path
        };
	    Reflect.defineMetadata(DESIGN_META_DATA.SERVICE, serviceWrapper, args[0]);
	}
}

export function ServiceMapping(mapping:{path : string | Array<string>, requestMethod?: string | Array<string>} ) {
    return function(... args : any[]): void {
        let typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
        let functionWrapper: Object = {
            path: mapping.path,
            requestMethod: mapping.requestMethod,
            returnType:typeInfo.returnType,
            awaitedType: typeInfo.awaitedType
        };
        Reflect.defineMetadata(DESIGN_META_DATA.SERVICE, functionWrapper, args[0], args[1]);
    }




    //return Reflect.metadata(DESIGN_META_DATA.SERVICE_MAPPING, functionWrapper);
}

//https://blogs.msdn.microsoft.com/typescript/2015/04/30/announcing-typescript-1-5-beta/
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-3
//https://www.typescriptlang.org/docs/handbook/decorators.html#metadata
//http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4

function Parameter(designMetaData: string, targetClass: any, methodName: string | symbol, index: number) {
    let paramType: string = Reflect.getMetadata("design:typeinfo", targetClass, methodName).paramTypes[index];
    let method: Function = targetClass[methodName];
    let paramName:string = getArguments(method)[index];
    let parameterWrapper: Object = {
        designMetaData: designMetaData,
        name: paramName,
        type: paramType
    };
    let parameterWrappers: Array<Object> = Reflect.getOwnMetadata(DESIGN_META_DATA.PARAMETER, targetClass, methodName) || [];
    parameterWrappers[index] = parameterWrapper;
    Reflect.defineMetadata(DESIGN_META_DATA.PARAMETER, parameterWrappers, targetClass, methodName);
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