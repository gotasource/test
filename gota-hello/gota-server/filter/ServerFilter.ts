export interface ServerFilter{
     doFilter(request: any, response: any, next: Function);
}