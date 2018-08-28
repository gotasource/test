import {Helper} from "../gota-core/index";
import {ServerFilter} from "./ServerFilter";
import {FileWrapper} from "./FileWrapper"

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


class ParseError extends Error {
     sourceValue: any;
     targetType: Function;
     constructor(sourceValue: any, targetType: Function){
          super(`Can not parse value: ${sourceValue}' - ${JSON.stringify(sourceValue)} to ${targetType.name}`);
          this.targetType = targetType;
          this.sourceValue = sourceValue;
     }
}

const converter = {
     stringToBoolean: function (source) {
          if(isNaN(source)){
               return ['true','yes','on'].includes(source.toLowerCase());
          }else{
               return +source > 0; // true <- 1,2,3, ..., false <- 0, -1, -2, ...
          }
     },
     stringToNumber: function (source) {
          if(isNaN(source)){
               return 0;
          }else{
               return +source;
          }
     },
     stringToDate: function (source) {
          if(isNaN(source)){
               // 'Wed Aug 08 2018 13:54:13' <= (new Date()).getToString()
               return new Date(source);
          }else{
               // 1533710985865 <= (new Date()).getTime()
               return new Date(+source);
          }
     },
     numberToDate: function (source) {
          return new Date(source);
     },
     numberToString: function (source) {
          return source+'';
     },
     numberToBoolean: function (source) {
          return source > 0;
     },
     booleanToString: function (source) {
          return source+'';
     },
     booleanToNumber: function (source) {
          return source ? 1 : 0;
     },
     fileWrapperToFile:  function (fileWrapper) {
          return fileWrapper;
     }
}

function parseValue(value, type){
     let val = value;
     if(type){
          if(Array.isArray(val)){
               val = val.map(item =>  parseValue(item, type));
          }else{
               if(val && val.constructor !== type){
                    try{
                         let parser = converter[val.constructor.name[0].toLowerCase()+val.constructor.name.substring(1) +'To'+type.name];
                         if(!parser){
                              //const isClass = v => typeof v === 'function' && /^\s*class\s+/.test(v.toString())
                              if (typeof type === 'function' && /^\s*class\s+/.test(type.toString())){
                                   if(typeof val === 'string'){
                                        val = JSON.parse(val);
                                   }
                                   let object = new type();
                                   //clear auto created properties by constructor
                                   Object.keys(object).forEach(property => {
                                        object[property] = undefined;
                                   });

                                   Object.keys(val).forEach(requestProperty => {
                                        let classProperty = Helper.separatePrefixSuffixAndPropertyItem(requestProperty).property;
                                        object[requestProperty] = parseValue(val[requestProperty], Helper.getTypeProperty(type, classProperty));
                                   })
                                   val = object;
                              }else {
                                   throw new ParseError(val, type);
                              }
                         }else {
                              val = parser(val);
                         }

                    }catch (err){
                         console.log(err.message);
                         throw new ParseError(val, type);
                    }
               }
          }
     }
     return val;
}

function buildArgumentValues(request: any, response: any){
     let parameterWrappers: Array<ParameterWrapper> =  request.serviceExecutor.arguments;
     let argumentValues: Array<any>;
     if(Array.isArray(parameterWrappers)){
          argumentValues = [];
          parameterWrappers.forEach(parameterWrapper => {
               let value = undefined;
               try{
                    switch(parameterWrapper.designMetaData){
                         case DESIGN_META_DATA.PATH_PARAMETER :
                              value = request.pathParameters[parameterWrapper.name];
                              break;
                         case DESIGN_META_DATA.REQUEST :
                              value = request;
                              break;
                         case DESIGN_META_DATA.RESPONSE :
                              value = response;
                              break;
                         case DESIGN_META_DATA.QUERY :
                              value = request.query || {};
                              break;
                         case DESIGN_META_DATA.QUERY_PARAMETER :
                              value = request.query ? request.query[parameterWrapper.name]: undefined;
                              break;
                         case DESIGN_META_DATA.BODY :
                              value = request.body || {};
                              break;
                         case DESIGN_META_DATA.BODY_PARAMETER :
                              value = request.body? request.body[parameterWrapper.name]: undefined;
                              break;
                         case DESIGN_META_DATA.HEADERS :
                              let headers = request.headers || {};
                              value = {};
                              Object.keys(headers).forEach(key =>{
                                   let lowerCamelCaseKey = key.replace(/\-[0-9a-zA-Z]/g, (match, offset, string) => {
                                        return (offset ? match.charAt(1).toUpperCase() :  match.charAt(1).toLowerCase());
                                   });
                                   value[lowerCamelCaseKey] = headers[key];
                              });

                              break;
                         case DESIGN_META_DATA.HEADERS_PARAMETER :
                              let argLowerCase = parameterWrapper.name.replace(/[A-Z]/g, (match, offset, string) => {
                                   return (offset ? '-' : '') + match.toLowerCase();
                              });
                              value =  request.headers[argLowerCase];
                              break;
                    }
                    if(typeof parameterWrapper['parser'] === 'function'){
                         value = parameterWrapper['parser'](value);
                    }else{
                         value = parseValue(value, parameterWrapper.type);
                    }

               }catch (err){
                    if(err instanceof ParseError){
                         console.log(err.message);
                         console.log('class: '+ request.serviceExecutor.context ? request.serviceExecutor.context.constructor.name:'');
                         console.log('method: '+ request.serviceExecutor.method ? request.serviceExecutor.method.name:'');
                         console.log('arg: '+ parameterWrapper.name);
                    }
                    throw err;

               }

               argumentValues.push(value);
          })
     }
     return argumentValues;
}

export class BuildArgumentValuesFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          request.argumentValues = buildArgumentValues(request, response);
          await next();
     }
}