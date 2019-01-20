import {ServerFilter} from "../filter/ServerFilter";
import {FileWrapper} from "../FileWrapper"
const encode = 'utf8';

function buildResponseData(response){
     let result = response.result;
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

     response.result = result;
     response.statusCode = 200;
}

export class BuildResponseDataFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          buildResponseData(response);
          await next();
     }
}