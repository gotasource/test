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
function getArguments(func: Function): Array<string> {
    let functionName: string = func.toString();
    // First match everything inside the function argument parens.
    var args = ('function ' + functionName).match(/function\s.*?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        // Ensure no undefined values are added.
        return arg;
    });
}

function getSuper(child: Function): Function {
    let _super: Function = undefined;
    if (Object.getPrototypeOf(child.prototype) && Object.getPrototypeOf(child.prototype).constructor){
        _super = Object.getPrototypeOf(child.prototype).constructor;
    }
    return _super;
}

function findDeclaredProperties(clazz: Function): Array<{ name: string, type: Function }> {
    let _clazz = clazz;
    let properties: Array<{ name: string, type: Function, itemType?: Function }> = [];
    while (_clazz.name && _clazz.name !== 'Object') {
        let p = (Reflect.getOwnMetadata(DESIGN_META_DATA.ENTITY, _clazz) || []).filter(item => properties.findIndex(i => i.name !== item.name));
        properties = [...p, ...properties];
        _clazz = Helper.findSuper(_clazz);
    }
    return properties;
}

function findDeclaredProperty(clazz: Function, propertyName: String): { name: String, type: Function, itemType?: Function } {
    let _clazz = clazz;
    let property: { name: String, type: Function, itemType?: Function };
    while (_clazz.name && _clazz.name !== 'Object') {
        let p: Array<{ name: string, type: Function, itemType?: Function }> = (Reflect.getOwnMetadata(DESIGN_META_DATA.ENTITY, _clazz) || []).filter(item => propertyName === item.name);
        if (p.length > 0) {
            property = p[0];
            break;
        }
        _clazz = Helper.findSuper(_clazz);
    }
    return property;
}


function collectSchema(clazz: Function): Array<{ name: String, properties: Array<{ name: String, type: String }> }> {
    let _clazz: Function = clazz;
    let schema: Array<{ name: String, properties: Array<{ name: String, type: String }> }> = [];
    let declaredProperties: Array<{ name: String, type: Function }> = Helper.findDeclaredProperties(_clazz);
    let properties: Array<{ name: String, type: String }>;
    if (declaredProperties.length > 0) {
        properties = declaredProperties.map(property => {
            let childSchema = Helper.collectSchema(property.type);
            if (childSchema.length > 0) {
                schema.push(...childSchema);
            }
            return {name: property.name, type: property.type.name};
        });
        schema.push({name: clazz.name, properties: properties});
        schema = schema.filter((item, index, target) => target.indexOf(item) === index);
    }
    return schema;
}

function getTypeProperty(clazz: Function, propertyName: String) {
    let property: { name: String, type: Function, itemType?: Function } = findDeclaredProperty(clazz, propertyName);
    return property ? property.type : undefined;
}

function getItemTypeProperty(clazz: Function, propertyName: String) {
    let property: { name: String, type: Function, itemType?: Function } = findDeclaredProperty(clazz, propertyName);
    return property ? property.itemType : undefined;
}


// $and:address.geographic.latitude$gte => {prefix: $and, suffix: $gte, property: address.geographic.latitude}
function separatePrefixSuffixAndPropertyItem(requestProperty: String): { prefix: String, suffix: String, property: String } {
    let prefix, suffix, property;
    //find  prefix
    let firstIndexColonSign = requestProperty.indexOf(':');
    if (requestProperty.indexOf('$') === 0 && firstIndexColonSign > 0) {// ex: end with $and of $and:address.geographic.latitude
        prefix = requestProperty.substring(0, firstIndexColonSign);
        requestProperty = requestProperty.substring(firstIndexColonSign + 1);
    }
    //find suffix
    let lastIndexDollarSign = requestProperty.lastIndexOf('$');
    let lastIndexColonSign = requestProperty.lastIndexOf(':');
    if (lastIndexDollarSign > lastIndexColonSign) {// ex: end with $gte of address.geographic.latitude$gte
        suffix = requestProperty.substring(lastIndexDollarSign);
        requestProperty = requestProperty.substring(0, lastIndexDollarSign);
    }
    // property
    property = requestProperty;
    //
    return {prefix, suffix, property};
}

function isNotEmptyObject(obj) {
    let result = false;
    if (obj !== null && obj !== undefined) {
        if (['string', 'number', 'boolean'].includes(typeof obj)) {
            result = true;
        } else {
            if (typeof obj === 'object') {
                if (obj instanceof String || obj instanceof Date || obj instanceof Number || obj instanceof Boolean) {
                    result = true;
                } else if (Object.keys(obj).length > 0) {
                    Object.keys(obj).forEach(property => {
                        if (!result) {
                            result = isNotEmptyObject(obj[property]);
                        }
                    });
                }
            }
        }
    }
    return result;
}

//function collectSchema(clazz:String): Array<{name: String, properties: Array<{name:String, type: String}>}>{
//    return null;
//}

function unUnitName(str: string): string {
    var re = new RegExp(/./g);
    str = str.toLowerCase();
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    str = str.replace(/a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, '(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)');
    str = str.replace(/e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, '(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)');
    str = str.replace(/i|ì|í|ị|ỉ|ĩ/g, '(i|ì|í|ị|ỉ|ĩ)');
    str = str.replace(/o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, '(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)');
    str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, '(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)');
    str = str.replace(/y|ỳ|ý|ỵ|ỷ|ỹ/g, '(y|ỳ|ý|ỵ|ỷ|ỹ)');
    str = str.replace(/d|đ/g, '(d|đ)');

    str = str.trim();
    str = str.replace(/ +/g, '(.*)');
    return str;
}

function searchVNStringRegexFormat(str: string): string {
    var re = new RegExp(/./g);
    str = str.toLowerCase();
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, '(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)');
    str = str.replace(/e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, '(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)');
    str = str.replace(/i|ì|í|ị|ỉ|ĩ/g, '(i|ì|í|ị|ỉ|ĩ)');
    str = str.replace(/o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, '(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)');
    str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, '(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)');
    str = str.replace(/y|ỳ|ý|ỵ|ỷ|ỹ/g, '(y|ỳ|ý|ỵ|ỷ|ỹ)');
    str = str.replace(/d|đ/g, '(d|đ)');

    str = str.trim();
    str = str.replace(/ +/g, '(.*)');
    return str;
}

function getDeeplyProperty(obj: object, property: string) {
    if (property.includes('.')) {//// EX: propertyPath === 'contact.email'
        try {
            return property.split('.').reduce((o, i) => o[i], obj);
        } catch (err) {
            return undefined;
        }
    }
    return obj[property];
}

function setDeeplyProperty(obj: object, property: string, value: any) {
    if (property === './') {
        obj = Object.assign(obj, value);
    } else if (!property.includes('.')) {//// EX: propertyPath === 'contact.email'
        obj[property] = value;
    } else {
        const propertyItem = property.split('.');
        const first = propertyItem.shift();
        obj[first] = obj[first] || {};
        const propertyObject = obj[first];
        setDeeplyProperty(propertyObject, propertyItem.join('.'), value);
    }
}

function setOrAddDeeplyProperty(obj: object, property: string, value: any) {
    if (property === './') {
        obj = Object.assign(obj, value);
    } else if (!property.includes('.')) {//// EX: propertyPath === 'contact.email'
        obj[property] = value;
    } else {
        const propertyItem = property.split('.');
        let first = propertyItem.shift();
        let propertyObject: any;
        if (first.endsWith('[]')) {//add item to array
            first = first.substring(0, first.length - '[]'.length);
            obj[first] = obj[first] || [];
            propertyObject = {};
            // @ts-ignore
            (obj[first] as Array).push(propertyObject);
        } else {
            obj[first] = obj[first] || {};
            propertyObject = obj[first];
        }
        setOrAddDeeplyProperty(propertyObject, propertyItem.join('.'), value);
    }
}

function addPrefixToProperties(obj: object, prefix: string) {
    if (typeof obj === 'object' && Object.entries(obj).length > 0) {
        Object.entries(obj).forEach(([key, value]) => {
            if (key.startsWith('$')) {
                obj[prefix] = obj[prefix] || {};
                obj[prefix][key] = value;
            } else {
                obj = Object.assign(obj, addPrefixToProperties(flatProperties(value),prefix + '.' + key));
            }
            delete (obj[key]);
        });
    }else{
        obj = {
            [prefix]:obj
        }
    }

    return obj;
}

function flatProperties(obj: any) {
    if (Array.isArray(obj)) {
        obj = (obj as Array<any>).map(item => flatProperties(item));
    } else if (typeof obj === 'object' && Object.entries(obj).length > 0) {
        Object.entries(obj).forEach(([key, value]) => {
            if (key.startsWith('$')) {
                obj[key] = flatProperties(value);
            } else {
                delete (obj[key]);
                Object.assign(obj, addPrefixToProperties(value as Object, key));
            }
        });
    }
    return obj;
}

function regexFormat(obj: any) {
    if (Array.isArray(obj)) {
        obj = (obj as Array<any>).map(item => regexFormat(item));
    } else if (typeof obj === 'object' && Object.entries(obj).length > 0) {
        Object.entries(obj).forEach(([key, value]) => {
            if (key === '$regex') {
                let regexValue = Helper.searchVNStringRegexFormat(value.toString());
                //value = {
                //    $regex: new RegExp(regexValue, 'i')
                //}

                obj = new RegExp(regexValue, 'i');
            } else {
                obj[key] = regexFormat(value);
            }
        });
    }
    return obj;
}
export default class Helper {
    public static getArguments: Function = getArguments;
    public static findSuper: Function = getSuper;
    public static findDeclaredProperties = findDeclaredProperties;
    public static findDeclaredProperty = findDeclaredProperty;
    public static collectSchema = collectSchema;
    public static getTypeProperty = getTypeProperty;
    public static getItemTypeProperty = getItemTypeProperty;
    public static isNotEmptyObject = isNotEmptyObject;
    public static separatePrefixSuffixAndPropertyItem = separatePrefixSuffixAndPropertyItem;
    public static unUnitName = unUnitName;
    public static searchVNStringRegexFormat = searchVNStringRegexFormat;
    public static getDeeplyProperty = getDeeplyProperty;
    public static setDeeplyProperty = setDeeplyProperty;
    public static setOrAddDeeplyProperty = setOrAddDeeplyProperty;
    public static flatProperties = flatProperties;
    public static regexFormat = regexFormat;

}

// var a= {};
//
// Helper.setOrAddDeeplyProperty(a,'$or[].name.$gt', 'hiep');
// Helper.setOrAddDeeplyProperty(a,'$or[].name', 'hong')
// Helper.setOrAddDeeplyProperty(a,'$or[].name', 'cao')
// console.dir(a);
// var a = {
//     $or: [{
//         address: {
//             street: 'Kulas Light'
//         }
//     },
//         {name: {$le: 10}}
//     ],
//     address: {
//         street: 'Kulas Light'
//     }
// };
// flatProperties(a);
// console.dir(a);
