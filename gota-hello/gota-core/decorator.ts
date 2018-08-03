import 'reflect-metadata'

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

export function PostInit(target : any, methodName : string) {
    let postInitMethodNames: Array<Object> = Reflect.getMetadata(DESIGN_META_DATA.POST_INIT, target) || [];
    postInitMethodNames.push(methodName);
    Reflect.defineMetadata(DESIGN_META_DATA.POST_INIT, postInitMethodNames, target);
}

export function AwaitedType(clazz:Function|string) {
    return function (...args: any[]): void {
        let typeInfo = Reflect.getMetadata("design:typeinfo", args[0], args[1]);
        typeInfo.awaitedType = clazz;
        Reflect.defineMetadata("design:typeinfo", typeInfo, args[0], args[1]);
    }
}