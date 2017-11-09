import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  compression from 'compression';
import "reflect-metadata";
import {accessSync} from "fs";

const DESIGN_META_DATA = {
    SERVICE : 'design:meta:data:key:service',
    PATH : 'design:meta:data:key:path',
    METHOD : 'design:meta:data:key:method',
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
    GET :'get',
    POST :'post',//create
    PUT :'put',// replace
    PATCH : 'patch',// update
    DELETE : 'delete'
};

//https://davidwalsh.name/javascript-arguments
function getArguments(func:Function) {
    let functionName = func.toString();
    // First match everything inside the function argument parens.
    var args = ('function '+ functionName).match(/function\s.*?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
        // Ensure no undefined values are added.
        return arg;
    });

}
export default class Booter<T> {
    public static allServices = [];
    protected service:T;
    protected app: any = express();
    constructor(service:T){
        //(c: {new(): T; })
        this.service = service;
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // parse application/json
        this.app.use(bodyParser.json());
        this.app.use(compression());
        let serviceClass = this.service.constructor;
        let servicePath = Reflect.getMetadata(DESIGN_META_DATA.PATH, serviceClass);
        Object.getOwnPropertyNames(serviceClass.prototype).forEach(methodName=>{
            if(methodName !== 'constructor'){
                let designMethod = Reflect.getMetadata(DESIGN_META_DATA.METHOD, this.service, methodName) || REQUEST_METHOD.GET;
                let designPath = Reflect.getMetadata(DESIGN_META_DATA.PATH, this.service, methodName);
                if(typeof designPath === 'string'){
                    designPath = [designPath];
                }
                designPath.forEach(path => {
                    this.app[designMethod](servicePath+path,(request: any, response: any)=> {
                        let method: Function = this.service[methodName];
                        let args = getArguments(method);
                        if(Array.isArray(args) && args.length>0){
                            let pathParameterIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.PATH_PARAMETER, serviceClass.prototype,  methodName) || [];
                            pathParameterIndexes.forEach(index=>{
                                args[index] = request.params[args[index]];
                            })
                            //query
                            let queryIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.QUERY, serviceClass.prototype,  methodName) || [];
                            queryIndexes.forEach(index=>{
                                args[index] = request.query;
                            })
                            let queryParameterIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.QUERY_PARAMETER, serviceClass.prototype,  methodName) || [];
                            queryParameterIndexes.forEach(index=>{
                                args[index] = request.query[args[index]];
                            })
                            //body
                            let bodyIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.BODY, serviceClass.prototype,  methodName) || [];
                            bodyIndexes.forEach(index=>{
                                args[index] = request.body;
                            })
                            let bodyParameterIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.BODY_PARAMETER, serviceClass.prototype,  methodName) || [];
                            bodyParameterIndexes.forEach(index=>{
                                args[index] = request.body[args[index]];
                            })
                            //headers
                            let headersIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.HEADERS, serviceClass.prototype,  methodName) || [];
                            headersIndexes.forEach(index=>{
                                args[index] = request.headers;
                            })
                            let headersParameterIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.HEADERS_PARAMETER, serviceClass.prototype,  methodName) || [];
                            headersParameterIndexes.forEach(index => {
                                let argLowerCase = args[index].replace(/[A-Z]/g, (match, offset, string)=> {
                                    return (offset ? '-' : '') + match.toLowerCase();
                                })
                                args[index] = request.headers[args[index]] || request.headers[argLowerCase];
                            })
                            //request
                            let requestIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.REQUEST, serviceClass.prototype,  methodName) || [];
                            requestIndexes.forEach(index=>{
                                args[index] = request;
                            })

                            //response
                            let responseIndexes = Reflect.getOwnMetadata(DESIGN_META_DATA.RESPONSE, serviceClass.prototype,  methodName) || [];
                            responseIndexes.forEach(index=>{
                                args[index] = response;
                            })
                        }
						
                        var returnType = Reflect.getMetadata("design:typeinfo", this.service, methodName).returnType;
                        if(returnType instanceof Function && returnType().name ==='Promise'){
                            method.apply(this.service, args).then(result =>{
                                if(result && !isNaN(result)){
                                    result = result.toString();
                                }
                                response.status(200).send(result);
                            });
                        }else{
                            let result = method.apply(this.service, args);
                            if(result && !isNaN(result)){
                                result = result.toString();
                            }
                            response.status(200).send(result);
                        }


                    });
                })

            }
        })

        //if(config.dev){
        if(true){
            let data:Array<any> = [];
            Object.getOwnPropertyNames(serviceClass.prototype).forEach(methodName=> {
                if (methodName !== 'constructor') {
                    let designMethod = Reflect.getMetadata(DESIGN_META_DATA.METHOD, this.service, methodName) || REQUEST_METHOD.GET;
                    let designPath = Reflect.getMetadata(DESIGN_META_DATA.PATH, this.service, methodName);
                    let item = {
                        method:designMethod,
                        urls: Array.isArray(designPath)?designPath.map(i=>{return servicePath+i}):undefined,
                        url: Array.isArray(designPath)?undefined:servicePath+designPath,
                    }
                    data.push(item);
                }
            })

            this.app.get(servicePath,(request, response)=> {
                response.send(data);
            })
        }

    }

    public getApp(){
        return  this.app;
    }
}