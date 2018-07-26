import {Entity} from "./decorator";
@Entity()
export class Model {
    _id?: string;
    constructor(object: any){
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