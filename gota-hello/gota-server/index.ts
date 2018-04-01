import { Server } from "http";
import  * as http from "http";
import * as fs from "fs";
const hostname = '127.0.0.1';
const port = 3000;
const encode = 'utf8';

const DESIGN_META_DATA = {
    APP : 'design:meta:data:key:app',
    CONFIG : 'design:meta:data:key:config',
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


interface ParameterWrapper {
    designMetaData: string,//Query, Path, Body
    name: string,
    type: any
}

class User {
    lastName: string;
    firstName: string;
}

export class FileWrapper{
    public name:string;
    public type:string;
    public content: Buffer;
    constructor(fileName: string, contentType: string, content: Buffer) {
        this.name = fileName;
        this.type = contentType;
        this.content =content;
    }
    saveFile(path:string):void{
        fs.writeFile(path + (path.endsWith('/') ? '': '/') + this.name, this.content, "binary", function (err) {
            if (err) {
                //console.log(err);
                throw err;
            } else {
                //console.log("the file was saved!");
            }
        });
    }

}

class ParseError extends Error {

}

const converter = {
    stringToNumber: function (str) {
        return new Number(str);
    },
    stringToDate: function (str) {
        return new Date(str);
    },
    fileWrapperToFile:  function (fileWrapper) {
        return fileWrapper;
    },
}

function parseValue(value, item){
    if(value && value.constructor !== item.type){
        try{
            let parser = item.parser || converter[value.constructor.name[0].toLowerCase()+value.constructor.name.substring(1) +'To'+item.type.name];
            if(!parser){
                //const isClass = v => typeof v === 'function' && /^\s*class\s+/.test(v.toString())
                if (typeof item.type === 'function' && /^\s*class\s+/.test(item.type.toString())){
                    let object = new item.type();
                    if(typeof value === 'string'){
                        value = JSON.parse(value);
                    }

                    Object.keys(value).forEach(key=>{
                        object[key] = value[key];
                    })
                    value = object;
                }else {
                    throw new ParseError('can not parse parameter '+ item.name +' from '+value.constructor.name +' to ' +item.type.name+', please add new parser');
                }
            }else {
                value = parser(value);
            }

        }catch (err){
            console.log(err.message);
            throw new ParseError('can not parse parameter '+ item.name +' from '+value.constructor.name +' to ' +item.type.name+', please add new parser');
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
    param +='="'; //Ex: name="userName"
    let value = undefined;
    let statIndex = buffer.indexOf(param, encode);
    if(statIndex > -1){
        statIndex += param.length;
        let endIndex = buffer.indexOf('"', statIndex);
        value = buffer.slice(statIndex, endIndex).toString(encode);
    }
    return value;
}

function getFileContentType(buffer) {
    let param = 'Content-Type: '; //Ex: name="userName"
    let value = undefined;
    let statIndex = buffer.indexOf(param, encode);
    if(statIndex > -1){
        statIndex += param.length;
        let endIndex = buffer.indexOf('\r\n\r\n', statIndex);
        value = buffer.slice(statIndex, endIndex).toString(encode);
    }
    return value;
}


export default class GotaServer{
    private mapping: object;
    private server: Server;
    constructor(){
        this.mapping = {
            abc:{
                POST:{
                    args:[
                        {
                            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'start',
                            type: Number
                        },
                        {
                            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'end',
                            type: Number
                        },
                        {
                            designMetaData : DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'name',
                            type: String
                        },
                        {
                            designMetaData : DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'avatar',
                            type: FileWrapper
                        }

                    ],
                    execute: function (start, end, name, avatar) {
                        return {
                            start:start,
                            end:end,
                            name: name,
                            fileName: avatar.name
                        }
                    },
                    context:null
                }
            },
            abcd:{
                POST:{
                    args:[
                        {
                            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'start',
                            type: Number
                        },
                        {
                            designMetaData : DESIGN_META_DATA.QUERY_PARAMETER,
                            name: 'end',
                            type: Number
                        },
                        {
                            designMetaData : DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'name',
                            type: User
                        },
                        {
                            designMetaData : DESIGN_META_DATA.BODY_PARAMETER,
                            name: 'year',
                            type: Number
                        }

                    ],
                    execute: function (start, end, name, year) {
                        return {
                            start:start,
                            end:end,
                            name: name,
                            year: year
                        }
                    },
                    context:null
                }
            },
            'abc/:ids/def/:id':{
                GET:{
                    args:[

                        {
                            designMetaData : DESIGN_META_DATA.PATH_PARAMETER,
                            name: 'ids',
                            type: String
                        },
                        {
                            designMetaData : DESIGN_META_DATA.PATH_PARAMETER,
                            name: 'id',
                            type: Number
                        }


                    ],
                    execute: function ( ids, id) {
                        return  {
                            ids: ids,
                            id:id
                        };
                    },
                    context:null
                }
            },
            'abc/def': {
                GET: {
                    execute: function () {
                        return new Date();
                    },
                    context:null
                }
            }
        };


        this.server = http.createServer((req: any, res: any) => {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Request-Method', '*');
            res.setHeader('Access-Control-Allow-Methods', `${REQUEST_METHOD.OPTIONS}, ${REQUEST_METHOD.GET}, ${REQUEST_METHOD.PATCH}`);
            res.setHeader('Access-Control-Allow-Headers', '*');


            let mapping = this.mapping;
            // console.log('URL:', req.url);
            // console.log('METHOD:', req.method);
            // console.log('HEADERS:', req.headers['content-type']);
            // console.log('HEADERS:', JSON.stringify(req.headers));

            let buffer = new Buffer([]);
            req.on('data', chunk => {
                buffer= Buffer.concat([buffer,chunk]);
            });
            req.on('end', () => {
                // console.log('No more data');
                // parse path {
                req.path =  req.url.substring(0, req.url.indexOf('?') > -1 ? req.url.indexOf('?') : undefined);
                // } parse path
                // parse query {
                if(req.url.indexOf('?')>-1){
                    let query = req.query || {};
                    let components = req.url.substring(req.url.indexOf('?')+1);
                    components = components.split('&');
                    components.forEach(component =>{
                        let name = component.split('=')[0];
                        let value = component.split('=')[1];
                        name = decodeURIComponent(name);
                        value = decodeURIComponent(value);
                        query[name] = value;
                    });
                    req.query = query
                }

                // } parse query

                // parse content {
                if(buffer.length>0){
                    let body = req.body || {};
                    let requestContentType = req.headers['content-type'];
                    try {
                        if(requestContentType){
                            if (requestContentType === 'application/x-www-form-urlencoded') {
                                let bufferLength = buffer.length;
                                let sliceCharacters = '&';
                                let components = buffer.toString(encode).split(sliceCharacters);
                                components.forEach(component => {
                                    let name = component.split('=')[0];
                                    let value = component.split('=')[1];
                                    name = decodeURIComponent(name);
                                    value = decodeURIComponent(value);
                                    body[name] = value;
                                });
                            } else if (requestContentType.indexOf('multipart/form-data') > -1) {
                                // https://www.stsbd.com/how-to-upload-large-images-optimally/
                                // http://www.javascriptexamples.info/search/upload-file-to-server-javascript/1
                                // http://igstan.ro/posts/2009-01-11-ajax-file-upload-with-pure-javascript.html
                                let bufferLength = buffer.length;
                                let sliceCharacters = '\r\n------';
                                while (bufferLength > 0) {
                                    let component = new Buffer(buffer.slice(0, buffer.indexOf(sliceCharacters)));
                                    buffer = new Buffer(buffer.slice(component.length + sliceCharacters.length));
                                    bufferLength = buffer.length;
                                    let name = getValueOfParam(component, 'name');
                                    if (name) {
                                        name = decodeURIComponent(name);
                                        // console.log('name:', name);
                                        let fileName = getValueOfParam(component, 'filename');
                                        if (fileName) {
                                            // console.log('filename:', fileName);
                                            let contentType = getFileContentType(component);
                                            // console.log('contenttype:', contentType);
                                            let content = new Buffer(component.slice((contentType + '\r\n\r\n').length + component.indexOf(contentType + '\r\n\r\n')));
                                            // console.log('content:', content.toString(encode));

                                            body[name] = new FileWrapper(fileName, contentType, content);

                                            /*
                                            fs.writeFile(fileName, content, "binary", function (err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    console.log("the file was saved!");
                                                }
                                            });
                                            */
                                        } else {
                                            let value = component.slice(component.indexOf('\r\n\r\n') + '\r\n\r\n'.length).toString(encode);
                                            value = decodeURIComponent(value);
                                            //console.log('value:', value);
                                            body[name] = value;
                                        }
                                    }
                                }
                            } else if(requestContentType.indexOf('application/json') > -1){
                                body = buffer.toString(encode);
                                body = JSON.parse(body);
                            } else if(requestContentType.indexOf('text') > -1){
                                body = buffer.toString(encode);
                            } else{
                                req.body = buffer;
                            }
                        } else {
                            req.body = buffer;
                        }

                        req.body = body;
                    } catch (err){
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Invalid Content Type\n');
                        return;
                    }
                }
                // } parse content



                let path = req.path;
                let pathArgs = {};
                let mappingPath = Object.keys(mapping).find((mappingPath) => {
                    let pathItems = path.split('/');
                    let mappingPathItems = mappingPath.split('/');
                    if(pathItems[0]===''){
                        pathItems.shift();
                    }
                    if(mappingPathItems[0]===''){
                        mappingPathItems.shift();
                    }

                    if(pathItems.length !== mappingPathItems.length){
                        return false;
                    } else {
                        for( let index = 0; index < mappingPathItems.length; index ++){
                            if(mappingPathItems[index].startsWith(':')){
                                pathArgs[mappingPathItems[index].substring(1)] = pathItems[index];
                            } else if(mappingPathItems[index] !== pathItems[index]){
                                return false;
                            }
                        }
                        return true;
                    }
                });
                let requestMethod = req.method;
                if(mappingPath === undefined || mapping[mappingPath][requestMethod]=== undefined){
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Not Found\n');
                    return;
                }

                let args = mapping[mappingPath][requestMethod]['args'];
                let execute = mapping[mappingPath][requestMethod]['execute'];
                let context =  mapping[mappingPath][requestMethod]['context'];
                // build agrs {
                let argValues = undefined;
                if(Array.isArray(args)){
                    argValues = [];
                    args.forEach(item => {
                        let value = undefined;
                        try{
                            switch(item.designMetaData){
                                case DESIGN_META_DATA.PATH_PARAMETER :
                                    value = pathArgs[item.name];
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.REQUEST :
                                    value = req;
                                    break;
                                case DESIGN_META_DATA.RESPONSE :
                                    value = res;
                                    break;
                                case DESIGN_META_DATA.QUERY :
                                    value = req.query || {};
                                    break;
                                case DESIGN_META_DATA.QUERY_PARAMETER :
                                    value = req.query ? req.query[item.name]: undefined;
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.BODY :
                                    value = req.body || {};
                                    break;
                                case DESIGN_META_DATA.BODY_PARAMETER :
                                    value = req.body? req.body[item.name]: undefined;
                                    value = parseValue(value, item);
                                    break;
                                case DESIGN_META_DATA.HEADERS :
                                    value = req.headers || {};
                                    break;
                                case DESIGN_META_DATA.HEADERS_PARAMETER :
                                    let argLowerCase = item.name.replace(/[A-Z]/g, (match, offset, string) => {
                                        return (offset ? '-' : '') + match.toLowerCase();
                                    });
                                    value =  req.headers[argLowerCase];
                                    value = parseValue(value, item);
                                    break;
                            }
                        }catch (err){
                            if(err instanceof ParseError){
                                console.log('class: '+ context ? context.constructor.name:'');
                                console.log('method: '+ execute ? execute.name:'');
                                console.log('arg: '+ item.name);
                            }
                            throw err;

                        }

                        argValues.push(value);
                    })
                }
                // } build agrs
                let promise = Promise.resolve(execute.apply(context, argValues));
                promise.then(result => {
                    if(result instanceof FileWrapper){
                        res.setHeader('Content-Type', result.type);
                        res.setHeader('Content-Disposition', 'attachment; filename='+result.name);
                        result = result.content;
                    }
                    if(typeof result === 'object'){
                        result = JSON.stringify(result);
                        res.setHeader('Content-Type', 'application/json');
                    }else {
                        result = result.toString();
                        res.setHeader('Content-Type', 'text/plain');
                    }
                    res.statusCode = 200;
                    // res.setHeader('Content-Type', 'text/plain');
                    res.end(result);
                }).catch(err =>{
                    console.log('Error 500: '+ err.message);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Internal Server Error\n');
                    return;
                });

            });

        });

    }

    addMapping(path, method, args, execute, context){
        this.mapping[path] = this.mapping[path] || {};
        if(!this.mapping[path][method]){
            console.log('Apply method "%s" for url: "%s"', method, path);
        }else{
            console.log('Replace method "%s" for url: "%s"', method, path);
        }

        this.mapping[path][method] = {
            args: args,
            execute : execute,
            context: context
        };

    }

    listen(port, hostname, callback){
        this.server.listen(port, hostname, callback);
        this.server.on('error', err => {console.log('There is a error when server start: '+err.message)})
    }
}

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