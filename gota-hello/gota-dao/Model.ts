import {Entity} from "./decorator";
@Entity()
export class Model {
    _id?: String | Number;
    id?: String | Number;
    constructor(object: any){
        if(!!object && Object.keys(object).length > 0){
            Object.keys(object).forEach(key=>{
                this[key] = object[key];
                // Object.defineProperty(this, key, {
                //     value: object[key],
                //     writable: true,
                //     enumerable: true,
                //     configurable: true
                // });
            });
        }
    }
}
