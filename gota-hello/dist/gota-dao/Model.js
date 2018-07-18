"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor(object) {
        Object.keys(object).forEach(key => {
            this[key] = object[key];
        });
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map