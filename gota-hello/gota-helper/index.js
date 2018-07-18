"use strict";
exports.__esModule = true;
//https://davidwalsh.name/javascript-arguments
function getArguments(func) {
    var functionName = func.toString();
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
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.getArguments = getArguments;
    return Helper;
}());
exports["default"] = Helper;
