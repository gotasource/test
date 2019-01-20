import {ServerFilter} from './ServerFilter'

export class ServerFilterWrapper{
    filter: ServerFilter;
    nextFilter: ServerFilterWrapper;
    constructor(filter: ServerFilter){
        this.filter = filter;
    }

    async doFilter(request: any, response: any, next: Function){
        await Promise.resolve(this.filter.doFilter(request, response, next));
    }

    async next(request: any, response: any){
        if(this.nextFilter !== undefined){
            await this.nextFilter.doFilter(request, response, async ()=>{
                await this.nextFilter.next(request, response);
            });
        }
        return;
    }
}