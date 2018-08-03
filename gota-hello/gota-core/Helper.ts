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

//const REQUEST_METHOD = {
//    OPTIONS: 'OPTIONS',
//    GET :'GET',
//    POST :'POST',//CREATE
//    PUT :'PUT',// REPLACE
//    PATCH : 'PATCH',// UPDATE
//    DELETE : 'DELETE'
//};
//export class RequestMethod{
//    static OPTIONS = 'OPTIONS';
//    static GET  =  'GET';
//    static  POST  = 'POST';
//    static  PUT  = 'PUT';
//    static  PATCH  = 'PATCH';
//    static  DELETE = 'DELETE';
//}

//https://davidwalsh.name/javascript-arguments
function getArguments(func:Function): Array<string> {
    let functionName:string = func.toString();
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

function  findSuper(child: Function): Function{
    let _super: Function = Object.getPrototypeOf(child.prototype).constructor;
    return _super;
}

function findDeclaredProperties(clazz:Function): Array<{name:string, type: Function}>{
    let _clazz = clazz;
    let properties:  Array<{name:string, type: Function}> = [];
    while (_clazz.name && _clazz.name !== 'Object'){
        let p = (Reflect.getOwnMetadata(DESIGN_META_DATA.ENTITY, _clazz)||[]).filter(item => properties.findIndex( i=> i.name !== item.name));
        properties = [...p, ...properties];
        _clazz = Helper.findSuper(_clazz);
    }
    return properties;
}

function collectSchema(clazz:Function): Array<{name: String, properties: Array<{name:String, type: String}>}>{
    let _clazz: Function = clazz;
    let schema: Array<{name: String, properties: Array<{name:String, type: String}>}> = []
    let declaredProperties: Array<{name:String, type: Function}> =  Helper.findDeclaredProperties(_clazz);
    let properties:  Array<{name:String, type: String}>
    if(declaredProperties.length>0){
        properties = declaredProperties.map(property => {
            let childSchema = Helper.collectSchema(property.type);
            if(childSchema.length>0){
                schema.push(...childSchema);
            }
            return {name:property.name, type:property.type.name};
        });
        schema.push({name: clazz.name, properties: properties});
        schema = schema.filter((item, index, target) => target.indexOf(item) === index);
    }
    return schema;
}

//function collectSchema(clazz:String): Array<{name: String, properties: Array<{name:String, type: String}>}>{
//    return null;
//}


export default class Helper{
    public static getArguments: Function = getArguments;
    public static findSuper: Function = findSuper;
    public static findDeclaredProperties = findDeclaredProperties
    public static collectSchema = collectSchema
}