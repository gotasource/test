"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var hostname = '127.0.0.1';
var port = 3000;
var encode = 'utf8';
var DESIGN_META_DATA = {
    APP: 'design:meta:data:key:app',
    CONFIG: 'design:meta:data:key:config',
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
    HEADERS_PARAMETER: 'design:meta:data:key:headers:parameter'
};
var REQUEST_METHOD = {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
var FileWrapper = /** @class */ (function () {
    function FileWrapper(fileName, contentType, content) {
        this.name = fileName;
        this.type = contentType;
        this.content = content;
    }
    FileWrapper.prototype.saveFile = function (path) {
        fs.writeFile(path + (path.endsWith('/') ? '' : '/') + this.name, this.content, "binary", function (err) {
            if (err) {
                //console.log(err);
                throw err;
            }
            else {
                //console.log("the file was saved!");
            }
        });
    };
    return FileWrapper;
}());
exports.FileWrapper = FileWrapper;
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ParseError;
}(Error));
var converter = {
    stringToNumber: function (str) {
        return new Number(str);
    },
    stringToDate: function (str) {
        return new Date(str);
    },
    fileWrapperToFile: function (fileWrapper) {
        return fileWrapper;
    }
};
function parseValue(value, item) {
    if (value && value.constructor !== item.type) {
        try {
            var parser = item.parser || converter[value.constructor.name[0].toLowerCase() + value.constructor.name.substring(1) + 'To' + item.type.name];
            if (!parser) {
                //const isClass = v => typeof v === 'function' && /^\s*class\s+/.test(v.toString())
                if (typeof item.type === 'function' && /^\s*class\s+/.test(item.type.toString())) {
                    var object_1 = new item.type();
                    if (typeof value === 'string') {
                        value = JSON.parse(value);
                    }
                    Object.keys(value).forEach(function (key) {
                        object_1[key] = value[key];
                    });
                    value = object_1;
                }
                else {
                    throw new ParseError('can not parse parameter ' + item.name + ' from ' + value.constructor.name + ' to ' + item.type.name + ', please add new parser');
                }
            }
            else {
                value = parser(value);
            }
        }
        catch (err) {
            console.log(err.message);
            throw new ParseError('can not parse parameter ' + item.name + ' from ' + value.constructor.name + ' to ' + item.type.name + ', please add new parser');
        }
    }
    return value;
}
/*

var writeFile = function (path, buffer, permission) {
    permission = permission || 438; // 0666
    var fileDescriptor;

    try {
        fileDescriptor = fs.openSync(path, 'w', permission);
    } catch (e) {
        fs.chmodSync(path, permission);
        fileDescriptor = fs.openSync(path, 'w', permission);
    }

    if (fileDescriptor) {
        fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
        fs.closeSync(fileDescriptor);
    }
}
*/
function getValueOfParam(buffer, param) {
    param += '="'; //Ex: name="userName"
    var value = undefined;
    var statIndex = buffer.indexOf(param, encode);
    if (statIndex > -1) {
        statIndex += param.length;
        var endIndex = buffer.indexOf('"', statIndex);
        value = buffer.slice(statIndex, endIndex).toString(encode);
    }
    return value;
}
function getFileContentType(buffer) {
    var param = 'Content-Type: '; //Ex: name="userName"
    var value = undefined;
    var statIndex = buffer.indexOf(param, encode);
    if (statIndex > -1) {
        statIndex += param.length;
        var endIndex = buffer.indexOf('\r\n\r\n', statIndex);
        value = buffer.slice(statIndex, endIndex).toString(encode);
    }
    return value;
}
var GotaServer = /** @class */ (function () {
    function GotaServer() {
        var _this = this;
        this.mapping = {
            abc: {
                POST: {
                    args: [
                        {
                            designMetaData: DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'start',
                            type: Number
                        },
                        {
                            designMetaData: DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'end',
                            type: Number
                        },
                        {
                            designMetaData: DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'name',
                            type: String
                        },
                        {
                            designMetaData: DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'avatar',
                            type: FileWrapper
                        }
                    ],
                    execute: function (start, end, name, avatar) {
                        return {
                            start: start,
                            end: end,
                            name: name,
                            fileName: avatar.name
                        };
                    },
                    context: null
                }
            },
            abcd: {
                POST: {
                    args: [
                        {
                            designMetaData: DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'start',
                            type: Number
                        },
                        {
                            designMetaData: DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'end',
                            type: Number
                        },
                        {
                            designMetaData: DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'name',
                            type: User
                        },
                        {
                            designMetaData: DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'year',
                            type: Number
                        }
                    ],
                    execute: function (start, end, name, year) {
                        return {
                            start: start,
                            end: end,
                            name: name,
                            year: year
                        };
                    },
                    context: null
                }
            },
            'abc/:ids/def/:id': {
                GET: {
                    args: [
                        {
                            designMetaData: DESIGN_META_DATA.PATH_PARAMETER,
                            name: 'ids',
                            type: String
                        },
                        {
                            designMetaData: DESIGN_META_DATA.PATH_PARAMETER,
                            name: 'id',
                            type: Number
                        }
                    ],
                    execute: function (ids, id) {
                        return {
                            ids: ids,
                            id: id
                        };
                    },
                    context: null
                }
            },
            'abc/def': {
                GET: {
                    execute: function () {
                        return new Date();
                    },
                    context: null
                }
            }
        };
        this.server = http.createServer(function (req, res) {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', REQUEST_METHOD.OPTIONS + ", " + REQUEST_METHOD.GET + ", " + REQUEST_METHOD.PATCH);
            res.setHeader('Access-Control-Allow-Headers', '*');
            var mapping = _this.mapping;
            // console.log('URL:', req.url);
            // console.log('METHOD:', req.method);
            // console.log('HEADERS:', req.headers['content-type']);
            // console.log('HEADERS:', JSON.stringify(req.headers));
            var buffer = new Buffer([]);
            req.on('data', function (chunk) {
                buffer = Buffer.concat([buffer, chunk]);
            });
            req.on('end', function () {
                // console.log('No more data');
                // parse path {
                req.path = req.url.substring(0, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : undefined);
                // } parse path
                // parse query {
                if (req.url.indexOf('?') > -1) {
                    var query_1 = req.query || {};
                    var components = req.url.substring(req.url.indexOf('?') + 1);
                    components = components.split('&');
                    components.forEach(function (component) {
                        var name = component.split('=')[0];
                        var value = component.split('=')[1];
                        name = decodeURIComponent(name);
                        value = decodeURIComponent(value);
                        query_1[name] = value;
                    });
                    req.query = query_1;
                }
                // } parse query
                // parse content {
                if (buffer.length > 0) {
                    var body_1 = req.body || {};
                    var requestContentType = req.headers['content-type'];
                    try {
                        if (requestContentType) {
                            if (requestContentType === 'application/x-www-form-urlencoded') {
                                var bufferLength = buffer.length;
                                var sliceCharacters = '&';
                                var components = buffer.toString(encode).split(sliceCharacters);
                                components.forEach(function (component) {
                                    var name = component.split('=')[0];
                                    var value = component.split('=')[1];
                                    name = decodeURIComponent(name);
                                    value = decodeURIComponent(value);
                                    body_1[name] = value;
                                });
                            }
                            else if (requestContentType.indexOf('multipart/form-data') > -1) {
                                // https://www.stsbd.com/how-to-upload-large-images-optimally/
                                // http://www.javascriptexamples.info/search/upload-file-to-server-javascript/1
                                // http://igstan.ro/posts/2009-01-11-ajax-file-upload-with-pure-javascript.html
                                var bufferLength = buffer.length;
                                var sliceCharacters = '\r\n------';
                                while (bufferLength > 0) {
                                    var component = new Buffer(buffer.slice(0, buffer.indexOf(sliceCharacters)));
                                    buffer = new Buffer(buffer.slice(component.length + sliceCharacters.length));
                                    bufferLength = buffer.length;
                                    var name_1 = getValueOfParam(component, 'name');
                                    if (name_1) {
                                        name_1 = decodeURIComponent(name_1);
                                        // console.log('name:', name);
                                        var fileName = getValueOfParam(component, 'filename');
                                        if (fileName) {
                                            // console.log('filename:', fileName);
                                            var contentType = getFileContentType(component);
                                            // console.log('contenttype:', contentType);
                                            var content = new Buffer(component.slice((contentType + '\r\n\r\n').length + component.indexOf(contentType + '\r\n\r\n')));
                                            // console.log('content:', content.toString(encode));
                                            body_1[name_1] = new FileWrapper(fileName, contentType, content);
                                            /*
                                            fs.writeFile(fileName, content, "binary", function (err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log("the file was saved!");
                                                }
                                            });
                                            */
                                        }
                                        else {
                                            var value = component.slice(component.indexOf('\r\n\r\n') + '\r\n\r\n'.length).toString(encode);
                                            value = decodeURIComponent(value);
                                            //console.log('value:', value);
                                            body_1[name_1] = value;
                                        }
                                    }
                                }
                            }
                            else if (requestContentType.indexOf('application/json') > -1) {
                                body_1 = buffer.toString(encode);
                                body_1 = JSON.parse(body_1);
                            }
                            else if (requestContentType.indexOf('text') > -1) {
                                body_1 = buffer.toString(encode);
                            }
                            else {
                                req.body = buffer;
                            }
                        }
                        else {
                            req.body = buffer;
                        }
                        req.body = body_1;
                    }
                    catch (err) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Invalid Content Type\n');
                        return;
                    }
                }
                // } parse content
                var path = req.path;
                var pathArgs = {};
                var mappingPath = Object.keys(mapping).find(function (mappingPath) {
                    var pathItems = path.split('/');
                    var mappingPathItems = mappingPath.split('/');
                    if (pathItems[0] === '') {
                        pathItems.shift();
                    }
                    if (mappingPathItems[0] === '') {
                        mappingPathItems.shift();
                    }
                    if (pathItems.length !== mappingPathItems.length) {
                        return false;
                    }
                    else {
                        for (var index = 0; index < mappingPathItems.length; index++) {
                            if (mappingPathItems[index].startsWith(':')) {
                                pathArgs[mappingPathItems[index].substring(1)] = pathItems[index];
                            }
                            else if (mappingPathItems[index] !== pathItems[index]) {
                                return false;
                            }
                        }
                        return true;
                    }
                });
                var requestMethod = req.method;
                if (mappingPath === undefined || mapping[mappingPath][requestMethod] === undefined) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Not Found\n');
                    return;
                }
                var args = mapping[mappingPath][requestMethod]['args'];
                var execute = mapping[mappingPath][requestMethod]['execute'];
                var context = mapping[mappingPath][requestMethod]['context'];
                // build agrs {
                var argValues = undefined;
                if (Array.isArray(args)) {
                    argValues = [];
                    args.forEach(function (item) {
                        var value = undefined;
                        try {
                            switch (item.designMetaData) {
                                case DESIGN_META_DATA.PATH_PARAMETER:
                                    value = pathArgs[item.name];
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.REQUEST:
                                    value = req;
                                    break;
                                case DESIGN_META_DATA.RESPONSE:
                                    value = res;
                                    break;
                                case DESIGN_META_DATA.QUERY:
                                    value = req.query || {};
                                    break;
                                case DESIGN_META_DATA.QUERY_PARAMETER:
                                    value = req.query ? req.query[item.name] : undefined;
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.BODY:
                                    value = req.body || {};
                                    break;
                                case DESIGN_META_DATA.BODY_PARAMETER:
                                    value = req.body ? req.body[item.name] : undefined;
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.HEADERS:
                                    value = req.headers || {};
                                    break;
                                case DESIGN_META_DATA.HEADERS_PARAMETER:
                                    var argLowerCase = item.name.replace(/[A-Z]/g, function (match, offset, string) {
                                        return (offset ? '-' : '') + match.toLowerCase();
                                    });
                                    value = req.headers[argLowerCase];
                                    value = parseValue(value, item);
                                    break;
                            }
                        }
                        catch (err) {
                            if (err instanceof ParseError) {
                                console.log('class: ' + context ? context.constructor.name : '');
                                console.log('method: ' + execute ? execute.name : '');
                                console.log('arg: ' + item.name);
                            }
                            throw err;
                        }
                        argValues.push(value);
                    });
                }
                // } build agrs
                var promise = Promise.resolve(execute.apply(context, argValues));
                promise.then(function (result) {
                    if (result instanceof FileWrapper) {
                        res.setHeader('Content-Type', result.type);
                        res.setHeader('Content-Disposition', 'attachment; filename=' + result.name);
                        result = result.content;
                    }
                    if (typeof result === 'object') {
                        result = JSON.stringify(result);
                        res.setHeader('Content-Type', 'application/json');
                    }
                    else {
                        result = result.toString();
                        res.setHeader('Content-Type', 'text/plain');
                    }
                    res.statusCode = 200;
                    // res.setHeader('Content-Type', 'text/plain');
                    res.end(result);
                })["catch"](function (err) {
                    console.log('Error 500: ' + err.message);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Internal Server Error\n');
                    return;
                });
            });
        });
    }
    GotaServer.prototype.addMapping = function (path, method, args, execute, context) {
        this.mapping[path] = this.mapping[path] || {};
        if (!this.mapping[path][method]) {
            console.log('Apply method "%s" for url: "%s"', method, path);
        }
        else {
            console.log('Replace method "%s" for url: "%s"', method, path);
        }
        this.mapping[path][method] = {
            args: args,
            execute: execute,
            context: context
        };
    };
    GotaServer.prototype.listen = function (port, hostname, callback) {
        this.server.listen(port, hostname, callback);
        this.server.on('error', function (err) { console.log('There is a error when server start: ' + err.message); });
    };
    return GotaServer;
}());
exports["default"] = GotaServer;
/*
let server = new GotaServer();
server.addMapping('abc/def','post',[
        {
            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
            name: 'start',
            type: Number
        },
        {
            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
            name: 'end',
            type: Number
        }],
    function(start, end){
        return {start: start, end: end}
    },
    null);
server.addMapping('abcdef','post',[
    {
        designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
        name: 'start',
        type: Number
    },
    {
        designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
        name: 'end',
        type: Number
    }], function(start, end){
    return {start: start, end: end}
}, null)
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/ 
