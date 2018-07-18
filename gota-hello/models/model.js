export class Model {
    constructor(object) {
        Object.keys(object).forEach(key => {
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
