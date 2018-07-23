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

class BeanContext {
    private static beans:object = {}
    public static  setBean(name: string, value: any):void{
        this.beans[name] = value;
    }
    public static getBean(name:string): any{
        return this.beans[name];
    }
}

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

export function Autowired(target : any, property : string) {
    let autowiredPropertyNames: Array<Object> = Reflect.getMetadata(DESIGN_META_DATA.AUTOWIRED, target) || [];
    autowiredPropertyNames.push(property);
    Reflect.defineMetadata(DESIGN_META_DATA.AUTOWIRED, autowiredPropertyNames, target);

    let t: any = Reflect.getMetadata("design:typeinfo", target, property).type();
    let obj = BeanContext.getBean(t.name);
    if(!(obj instanceof t)){
        obj = new t();
        BeanContext.setBean(t.name, obj);
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

// export { BeanContext }