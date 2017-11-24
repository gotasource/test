import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  compression from 'compression';
import "reflect-metadata";
import {accessSync} from "fs";
import Helper from "../gota-helper/index";

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

interface ParameterWrapper{
    designMetaData: string,//Query, Path, Body
    name: string,
    type: any,
    value?:any
}

interface FunctionWrapper{
    function: Function;
    requestMethod: string | Array<string>
    path: string | Array<string>
    parameterWrappers: Array<ParameterWrapper>;
    returnType: any;
    awaitedType?: any;
}

interface ServiceWrapper{
    service: any;
    path: string | Array<string>;
    functionWrappers: Array<FunctionWrapper>;
}

interface ServiceInformation{
    requestMethod:string;
    path:string;
    returnType: Function;
    awaitedType?: Function;
    requestInformation: Array<ParameterWrapper>;
    service: Object;
    function: Function;
}

export default class Booter {
    private static buildServiceWrapper(service: any): ServiceWrapper {
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
                methodWrappers.push(methodWrapper)
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
        let parameterMetaData = Reflect.getMetadata(DESIGN_META_DATA.PARAMETER, service,  methodName);
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

    private static getArguments(request: any, response: any, parameterWrappers: Array<ParameterWrapper>,): Array<any> {
        let _arguments:Array<any> = []
        if (Array.isArray(parameterWrappers) && parameterWrappers.length > 0) {
            parameterWrappers.forEach(parameterWrapper => {
                let designMetaData = parameterWrapper.designMetaData;
                let parameterName = parameterWrapper.name;
                switch (designMetaData) {
                    case DESIGN_META_DATA.PATH_PARAMETER:
                        _arguments.push(request.params[parameterName]);
                        break;
                    case DESIGN_META_DATA.QUERY:
                        _arguments.push(request.query);
                        break;
                    case DESIGN_META_DATA.QUERY_PARAMETER:
                        _arguments.push(request.query[parameterName]);
                        break;
                    case DESIGN_META_DATA.BODY:
                        _arguments.push(request.body);
                        break;
                    case DESIGN_META_DATA.BODY_PARAMETER:
                        _arguments.push(request.body[parameterName]);
                        break;
                    case DESIGN_META_DATA.HEADERS:
                        _arguments.push(request.headers);
                        break;
                    case DESIGN_META_DATA.HEADERS_PARAMETER:
                        let argLowerCase = parameterName.replace(/[A-Z]/g, (match, offset, string) => {
                            return (offset ? '-' : '') + match.toLowerCase();
                        });
                        _arguments.push(request.headers[parameterName] || request.headers[argLowerCase]);
                        break;
                    case DESIGN_META_DATA.REQUEST:
                        _arguments.push(request);
                        break;
                    case DESIGN_META_DATA.RESPONSE:
                        _arguments.push(response);
                    default:
                        break;
                }
            });
        }
        return _arguments;
    }

    private static collectServiceInformation(serviceWrapper: ServiceWrapper): Array<ServiceInformation>{
        let serviceInformationList: Array<ServiceInformation> = [];

        let servicePaths = serviceWrapper.path;
        if(typeof servicePaths === 'string'){
            servicePaths = [servicePaths.toString()];
        }
        let functionWrappers = serviceWrapper.functionWrappers;
        servicePaths.forEach(servicePath => {
            functionWrappers.forEach(functionWrapper => {
                let requestMethods = functionWrapper.requestMethod;
                if(typeof requestMethods === 'string'){
                    requestMethods = [requestMethods.toString()];
                }
                requestMethods.forEach(requestMethod=>{
                    let functionPaths = functionWrapper.path;
                    if(typeof functionPaths === 'string'){
                        functionPaths = [functionPaths.toString()];
                    }
                    functionPaths.forEach(functionPath =>{
                        let path = servicePath + functionPath;
                        let serviceInformation: ServiceInformation = {
                            path:path,
                            requestMethod:requestMethod,
                            service: serviceWrapper.service,
                            function: functionWrapper.function,
                            returnType: functionWrapper.returnType,
                            awaitedType: functionWrapper.awaitedType,
                            requestInformation: functionWrapper.parameterWrappers
                        }
                        serviceInformationList.push(serviceInformation)
                    })
                })
            });
        })
        return serviceInformationList;
    }

    private static collectOptionsServiceInformation(serviceInformationList: Array<ServiceInformation>): any{
        let urls = serviceInformationList
            .map(item => item.path)
            .filter((item, pos, self) => self.indexOf(item) == pos);

        let collectionOptionService = {};
        urls.forEach(url => {
            let collectionOptionServiceItem = collectionOptionService[url] || {};
            sameUrlServiceInformation = serviceInformationList.filter(item => item.path===url);
            sameUrlServiceInformation.forEach(serviceInformation =>{
                collectionOptionServiceItem[serviceInformation.requestMethod] = {
                    service: serviceInformation.service,
                    function: serviceInformation.function,
                    returnType: serviceInformation.returnType,
                    awaitedType: serviceInformation.awaitedType,
                    requestInformation: serviceInformation.parameterWrappers
                }
            });
            collectionOptionService[url] = collectionOptionServiceItem;
        });

        return collectionOptionService;
    }

    private static bootACollectionServiceItem(expressApplication: any, serviceInformation: ServiceInformation):void{
        let app = expressApplication;
        let path: string = serviceInformation.path;
        let requestMethod: string = serviceInformation.requestMethod ;
        let _function = serviceInformation.function;
        let service = serviceInformation.service;
        serviceInformation
        app[requestMethod](path, (req, res) => {
            let _arguments = this.getArguments(req, res, serviceInformation.requestInformation);

            let promise: Promise<any> = Promise.resolve(_function.apply(service, _arguments));
            promise.then(result => {
                if(result && !isNaN(result)){
                    result = result.toString();
                }
                res.status(200).send(result);
            });
            /*
            if(serviceInformation.awaitedType){
                let promise: Promise<any> = _function.apply(service, _arguments);
                promise.then(result => {
                    if(result && !isNaN(result)){
                        result = result.toString();
                    }
                    res.status(200).send(result);
                });
            }else{
                let result = _function.apply(service, _arguments);
                if(result && !isNaN(result)){
                    result = result.toString();
                }
                res.status(200).send(result);
            }*/
        })
    }

    private static bootAOptionsCollectionServiceItem(expressApplication: any, coptionsServiceInformation: any):void{
        let app = expressApplication;
        let path: string = serviceInformation.path;
        let requestMethod: string = serviceInformation.requestMethod ;
        let _function = serviceInformation.function;
        let service = serviceInformation.service;
        serviceInformation
        app[requestMethod](path, (req, res) => {
            let _arguments = this.getArguments(req, res, serviceInformation.requestInformation);

            let promise: Promise<any> = Promise.resolve(_function.apply(service, _arguments));
            promise.then(result => {
                if(result && !isNaN(result)){
                    result = result.toString();
                }
                res.status(200).send(result);
            });
        })
    }




    private static bootCollectionService(expressApplication: any, config: any, collectionService: Array<ServiceInformation>):void{
        collectionService.forEach(serviceInformation => {
            if(config.devMode){
                console.log('Apply method "%s" for url: "%s"', serviceInformation.requestMethod, serviceInformation.path);
            }
            this.bootACollectionServiceItem(expressApplication, serviceInformation);
        })
    }

    private static bootOptionsCollectionService(expressApplication: any, config: any, collectionOptionsServiceInformation: any):void{

    }

    public static bootService(expressApplication: any, config: object, service: any){
        let serviceWrapper: ServiceWrapper = Booter.buildServiceWrapper(service);
        let collectionServiceInformation: Array<ServiceInformation> = Booter.collectServiceInformation(serviceWrapper);
        let collectionOptionsServiceInformation: any = Booter.collectOptionsServiceInformation(collectionServiceInformation);

        Booter.bootCollectionService(expressApplication, config, serviceInformationList);
        Booter.bootOptionsCollectionService(expressApplication, config, collectionOptionsServiceInformation);
    }



}