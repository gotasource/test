import {ServerFilter} from "./ServerFilter";
import {FileWrapper} from "./FileWrapper"
const encode = 'utf8';

export class ParseRequestPathFilter implements ServerFilter{
     async doFilter(request: any, response: any, next: Function){

          //
          await next();
     }
}