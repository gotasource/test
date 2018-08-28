import {ServerFilter} from "./ServerFilter";
import {FileWrapper} from "./FileWrapper"
const encode = 'utf8';

function buildQueryData(request){
     if(request.url.indexOf('?')>-1){
          let query = request.query || {};
          let components = request.url.substring(request.url.indexOf('?')+1);
          components = components.split('&');
          components.forEach(component =>{
               let name = component.split('=')[0];
               let value = component.split('=')[1];
               name = decodeURIComponent(name);
               value = decodeURIComponent(value);
               if(!query[name]){
                    query[name] = value;
               }else if(Array.isArray(query[name])){
                    query[name].push(value);
               }else{
                    query[name] = [query[name], value];
               }
          });
          request.query = query
     }
}

export class BuildRequestQueryFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){
          buildQueryData(request);
          await next();
     }
}