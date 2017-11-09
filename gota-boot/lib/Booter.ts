import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  compression from 'compression';
import "reflect-metadata";
import {accessSync} from "fs";

const DESIGN_META_DATA = {
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

export interface ParameterWrapper{
    designMetaData: string,//Query, Path, Body
    name: string,
    type: any,
    value?:any
}

export class FunctionWrapper{
    function: Function;
    requestMethod: string | Array<string>
    path: string | Array<string>
    parameterWrappers: Array<ParameterWrapper>;
    returnType: any;
    awaitedType?: any;
}

export interface ServiceWrapper{
    service: any;
    path: string | Array<string>;
    functionWrappers: Array<FunctionWrapper>;
}

export default class Booter {
    public static buildServiceWrapper(service: any): ServiceWrapper {
        let serviceClass = service.constructor;
        let serviceMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE, serviceClass);
        let functionWrappers = this.buildMethodWrappers(service);
        let serviceWrapper: ServiceWrapper = {
            service: service,
            path: serviceMetaData.path,
            functionWrappers: functionWrappers
        };
        return serviceWrapper;
    }

    private static buildMethodWrappers(service: any): Array<FunctionWrapper>{
        let methodWrappers: Array<FunctionWrapper> = [];
        Object.getOwnPropertyNames(service.constructor.prototype).forEach(methodName=> {
            if (methodName !== 'constructor') {
                let methodWrapper = this.buildMethodWrapper(service, methodName);
                methodWrappers.push()
            }
        });
        return methodWrappers;
    }

    private static buildMethodWrapper(service: any, methodName:string): FunctionWrapper{
        let _function: Function = service[methodName];
        let methodMetaData = Reflect.getMetadata(DESIGN_META_DATA.SERVICE_MAPPING, service, methodName);
        let parameterWrappers: Array<ParameterWrapper> = this.buildParameterWrappers(service, methodName);

        let functionWrapper: FunctionWrapper = {
            function: _function,
            requestMethod: methodMetaData.requestMethod || REQUEST_METHOD.GET,
            path: methodMetaData.path,
            returnType:methodMetaData.returnType,
            awaitedType: methodMetaData.awaitedType,
            parameterWrappers: parameterWrappers
        }
        return functionWrapper;
    }

    private static buildParameterWrappers(service: any, methodName:string): Array<ParameterWrapper>{
        let parameterWrappers: Array<ParameterWrapper> =[];
        let parameterMetaData = Reflect.getOwnMetadata(DESIGN_META_DATA.PARAMETER, service,  methodName);
        if(Array.isArray(parameterMetaData)) {
            parameterMetaData.forEach(parameterItem=>{
                let parameterWrapper: ParameterWrapper = {
                    designMetaData: parameterItem.designMetaData,
                    name: parameterItem.name,
                    type: parameterItem.type
                }
                parameterWrappers.push(parameterWrapper)
            });
        }
        return parameterWrappers;
    }

    private static parseArguments(parameterWrappers: Array<ParameterWrapper>, request: any, response: any): Array<ParameterWrapper> {
        if (Array.isArray(parameterWrappers) && parameterWrappers.length > 0) {
            parameterWrappers.forEach(parameterWrapper => {
                let designMetaData = parameterWrapper.designMetaData;
                let parameterName = parameterWrapper.name;
                switch (designMetaData) {
                    case DESIGN_META_DATA.PATH_PARAMETER:
                        parameterWrapper.value = request.params[parameterName];
                        break;
                    case DESIGN_META_DATA.QUERY:
                        parameterWrapper.value = request.query;
                        break;
                    case DESIGN_META_DATA.QUERY_PARAMETER:
                        parameterWrapper.value = request.query[parameterName];
                        break;
                    case DESIGN_META_DATA.BODY:
                        parameterWrapper.value = request.body;
                        ;
                        break;
                    case DESIGN_META_DATA.BODY_PARAMETER:
                        parameterWrapper.value = request.body[parameterName];
                        break;
                    case DESIGN_META_DATA.HEADERS:
                        parameterWrapper.value = request.headers
                        break;
                    case DESIGN_META_DATA.HEADERS_PARAMETER:
                        let argLowerCase = parameterName.replace(/[A-Z]/g, (match, offset, string) => {
                            return (offset ? '-' : '') + match.toLowerCase();
                        })
                        parameterWrapper.value = request.headers[parameterName] || request.headers[argLowerCase];
                        break;
                    case DESIGN_META_DATA.REQUEST:
                        parameterWrapper.value = request;
                        break;
                    case DESIGN_META_DATA.RESPONSE:
                        parameterWrapper.value = response;
                    default:
                        break;
                }
            });
            return parameterWrappers;
        }

    }
    public static boot(expressApp: any, serviceWrapper: ServiceWrapper): void{

        let servicePaths = serviceWrapper.path;
        if(typeof servicePaths === 'string'){
            servicePaths = [servicePaths];
        }
        let functionWrappers = serviceWrapper.functionWrappers;
        servicePaths.forEach(servicePath => {
            functionWrappers.forEach(functionWrapper => {
                let requestMethods = functionWrapper.requestMethod;
                if(typeof requestMethods === 'string'){
                    requestMethods = [requestMethods];
                }
                requestMethods.forEach(requestMethod=>{
                    let functionPaths = functionWrapper.path;
                    if(typeof functionPaths === 'string'){
                        functionPaths = [functionPaths];
                    }
                    functionPaths.forEach(functionPath =>{
                        let path = servicePath + functionPath;
                        expressApp[requestMethod](path, (request: any, response: any)=> {
                            let _arguments: Array<ParameterWrapper> = this.parseArguments(functionWrapper.parameterWrappers, request, response);
                            _arguments = _arguments.map(arg => arg.value);
                            let func = functionWrapper.function;
                            let service = serviceWrapper.service;
                            if(functionWrapper.awaitedType){
                                func.apply(service, _arguments).then(result =>{
                                    if(result && !isNaN(result)){
                                        result = result.toString();
                                    }
                                    response.status(200).send(result);
                                });
                            }else{
                                let result = func.apply(service, _arguments);
                                if(result && !isNaN(result)){
                                    result = result.toString();
                                }
                                response.status(200).send(result);
                            }
                        });
                    })
                })
            });
        })
    }
}