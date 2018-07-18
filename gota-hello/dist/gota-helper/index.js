"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getArguments(func) {
    let functionName = func.toString();
    var args = ('function ' + functionName).match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
}
class Helper {
}
Helper.getArguments = getArguments;
exports.default = Helper;
//# sourceMappingURL=index.js.map