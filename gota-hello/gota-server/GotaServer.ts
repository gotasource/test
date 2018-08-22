import { Server } from "http";
import  * as http from "http";

import * as fs from "fs";
import {Helper} from "../gota-core/index";
import {ServerFilter} from "./ServerFilter";
import {ServerFilterContainer} from "./ServerFilterContainer";
import {ServerFilterWrapper} from "./ServerFilterWrapper";
import {FileWrapper} from "./FileWrapper";
import { BuildRequestBodyFilter } from "./BuildRequestBodyFilter";
import {BuildRequestQueryFilter} from "./BuildRequestQueryFilter";
import {BuildArgumentValuesFilter} from "./BuildArgumentValuesFilter";
const hostname = '127.0.0.1';
const port = 3000;
const encode = 'utf8';
//const Request = http.IncomingMessage;
//const Response = http.ServerResponse;

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


//class User {
//    lastName: string;
//    firstName: string;
//}



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


class TestFilter implements ServerFilter{
    async doFilter(request: any, response: any, next: Function){
        console.log('test        test          test');
        await next();
    }
}

class TestFilter2 implements ServerFilter{
    async doFilter(request: any, response: any, next: Function){
        console.log('test2222        test2222          test22222');
        await next();
    }
}

class Executor{
    context:any;
    method: Function;
    arguments: Array<any>
    constructor(context: any, method: Function, args: Array<any>){
        this.context = context;
        this.method = method;
        this.arguments = args;
    }
}

class ExecutorContainer{
    private mapping: Object;
    constructor(){
        this.mapping ={};
    }

    addMapping(path: string, requestMethod: string, executor: Executor){
        this.mapping[path] = this.mapping[path] || {};
        if(!this.mapping[path][requestMethod]){
            console.log('Apply method "%s" for url: "%s"', requestMethod, path);
        }else{
            console.log('Replace method "%s" for url: "%s"', requestMethod, path);
        }
        this.mapping[path][requestMethod] = executor;
    }

    findExecutorInformation(path: string, requestMethod: string): {mappingPath: String, executor: Executor, pathParameters: Object}{
        let pathParameters = {};
        let mapping = this.mapping;
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
                        pathParameters[mappingPathItems[index].substring(1)] = pathItems[index];
                    } else if(mappingPathItems[index] !== pathItems[index]){
                        return false;
                    }
                }
                return true;
            }
        });
        if(mappingPath){
            let executor = mapping[mappingPath][requestMethod];
            return {mappingPath, executor, pathParameters };
        }else{
            return undefined;
        }

    }
}

export class GotaServer{
    private serverFilterContainer: ServerFilterContainer = new ServerFilterContainer();
    private executorContainer: ExecutorContainer = new ExecutorContainer();
    private server: Server;
    constructor(){
        //
        this.addFilter(new BuildRequestQueryFilter());
        this.addFilter(new BuildRequestBodyFilter());
        this.addFilter(new BuildArgumentValuesFilter());
        //
        this.addFilter(new TestFilter());
        this.addFilter(new TestFilter2());

        this.server = http.createServer((request: any/*#<http.IncomingMessage>*/, response: any/*#<http.ServerResponse>*/) => {
            // console.log('URL:', request.url);
            // console.log('METHOD:', request.method);
            // console.log('HEADERS:', request.headers['content-type']);
            // console.log('HEADERS:', request.stringify(req.headers));

            // Set CORS headers
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Request-Method', '*');
            response.setHeader('Access-Control-Allow-Methods', `${REQUEST_METHOD.OPTIONS}, ${REQUEST_METHOD.GET}, ${REQUEST_METHOD.PATCH}`);
            response.setHeader('Access-Control-Allow-Headers', '*');

            request.serverContext = this;

            let buffer = new Buffer([]);
            //
            request.on('data', chunk => {
                buffer= Buffer.concat([buffer,chunk]);
            });
            //
            request.on('end', async () => {
                // console.log('No more data');
                request.body = buffer;
                request.path =  request.url.substring(0, request.url.indexOf('?') > -1 ? request.url.indexOf('?') : undefined);
                // build pathParameters and find serviceExecutor in executorContainer
                let executorInformation = this.executorContainer.findExecutorInformation(request.path, request.method);
                if(executorInformation === undefined){
                    response.statusCode = 404;
                    response.setHeader('Content-Type', 'text/plain');
                    response.end('Not Found\n');
                    return;
                }
                request.pathParameters = executorInformation.pathParameters;
                request.serviceExecutor = executorInformation.executor;

                await this.serverFilterContainer.executeFilters(request, response);

                try {
                    let execute = executorInformation.executor.method;
                    let context =  executorInformation.executor.context;
                    let argValues = request.argumentValues;

                    let result = await Promise.resolve(execute.apply(context, argValues));
                    if(result instanceof FileWrapper){
                        response.setHeader('Content-Type', result.type);
                        response.setHeader('Content-Disposition', 'attachment; filename='+result.name);
                        result = result.content;
                    }
                    if(typeof result === 'object'){
                        result = JSON.stringify(result);
                        response.setHeader('Content-Type', 'application/json');
                    }else {
                        result = result.toString();
                        response.setHeader('Content-Type', 'text/plain');
                    }
                    response.statusCode = 200;
                    response.end(result);
                }catch (err){
                    console.log('Error 500: '+ err.message);
                    console.log('\n'+ err.stack);
                    response.statusCode = 500;
                    response.setHeader('Content-Type', 'text/plain');
                    response.end('Internal Server Error\n');
                    return;
                }
            });

        });

    }

    addMapping(path, requestMethod, args, execute, context){
        let executor: Executor = new Executor(context, execute, args);
        this.executorContainer.addMapping(path, requestMethod, executor);
    }

    addFilter(filter: ServerFilter){
        let serverFilterWrapper: ServerFilterWrapper = new ServerFilterWrapper(filter);
        this.serverFilterContainer.addFilter(serverFilterWrapper);
    }

    listen(port, hostname, callback){
        this.server.listen(port, hostname, callback);
        this.server.on('error', err => {
            console.log('There is a error when server start: '+err.message);
        });
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