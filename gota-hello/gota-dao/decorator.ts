
//https://rbuckton.github.io/reflect-metadata/#syntax
import 'reflect-metadata'
import { Helper } from "../gota-core/index";
import { Model } from './Model';
import { DataAccess } from './interface/DataAccess';

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
    ENTITY : 'design:meta:data:key:entity',
    ENTITY_CONTAINER : 'design:meta:data:key:entity:container',
    FIELD_DYNAMIC_ACCESS_MODE : 'design:meta:data:key:field:dynamic:access:mode',
    DAO_OF_MODEL: 'design:meta:data:key:dao:of:model',
    MODEL_OF_DAO: 'design:meta:data:key:model:of:dao'
};

const REQUEST_METHOD = {
    OPTIONS: 'OPTIONS',
    GET :'GET',
    POST :'POST',//CREATE
    PUT :'PUT',// REPLACE
    PATCH : 'PATCH',// UPDATE
    DELETE : 'DELETE'
};
//export class RequestMethod{
//    static OPTIONS = 'OPTIONS';
//    static GET  =  'GET';
//    static  POST  = 'POST';
//    static  PUT  = 'PUT';
//    static  PATCH  = 'PATCH';
//    static  DELETE = 'DELETE';
//}

export class EntityContainer{
    private static entities: Array<Function> = [];
    public static addEntity(entity: Function){
        this.entities.push(entity);
    }
    public static getEntities():Array<Function>{
        return this.entities;
    }
    public static findEntity(name:String): Function{
        return this.entities.find(item => item.name === name);
    }
}

export function Entity(properties?: Array<{name:string, type: Function, dynamicAccessMode?: Array<String>}>){
	return function(... args : any[]): void {
        let clazz = args[0];
        properties.forEach(property =>{
            let dynamicAccessModes = Reflect.getMetadata(DESIGN_META_DATA.FIELD_DYNAMIC_ACCESS_MODE, clazz.prototype, property.name);
            if(Array.isArray(dynamicAccessModes)){
                property.dynamicAccessMode = dynamicAccessModes;
            }
        });
        let superClazz = Helper.findSuper(args[0]);
        let superProperties = (Helper.findDeclaredProperties(superClazz)||[]).filter(item => properties.findIndex(i => i.name !== item.name));
        let propertiesPlus =  [... superProperties, ... properties];
	    Reflect.defineMetadata(DESIGN_META_DATA.ENTITY, propertiesPlus, args[0]);
        EntityContainer.addEntity(args[0]);
	}
}

export function Field(){
    return function(... args : any[]): void {
        let clazz = Helper.findSuper(args[0]);
        let propertiesPlus =  [... Helper.findDeclaredProperties(clazz)];
        Reflect.defineMetadata(DESIGN_META_DATA.ENTITY, propertiesPlus, args[0]);
    }
}

export class DynamicAccessMode{
    static READ  = 'READ';
    static WRITE = 'WRITE';
}

export function DynamicAccess(modes: String | Array<String>){
    let _modes:Array<String>;
    if(!Array.isArray(modes)){
        _modes = [modes as String];
    }else{
        _modes = modes as Array<String>;
    }

    return function(... args : any[]): void {
        let prototype = args[0];
        let property = args[1];
        Reflect.defineMetadata(DESIGN_META_DATA.FIELD_DYNAMIC_ACCESS_MODE, _modes, prototype, property);
    }
}

export function DAO<T extends { new(...args: any[]):  Model }>(entity: T){
    return function(target: Function) {
        var original = target;
        Reflect.defineMetadata(DESIGN_META_DATA.DAO_OF_MODEL, target, entity);
        Reflect.defineMetadata(DESIGN_META_DATA.MODEL_OF_DAO, entity, target);
        /*
        // the new constructor behaviour
        var CustomType : any = function (...args) {
            this.collectionName = entity.name.replace(/[A-Z]/g, (match, offset, string) => {
                return (offset ? '_' : '') + match.toLowerCase();
            });
            return  original.constructor.apply(this, args)
        }

        // copy prototype so intanceof operator still works
        CustomType.prototype = original.prototype;
        CustomType.originalType = original;

        // return new constructor (will override original)
        return CustomType;
        */

    }
}

