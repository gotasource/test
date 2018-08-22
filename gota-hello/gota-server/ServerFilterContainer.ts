import {ServerFilterWrapper} from './ServerFilterWrapper'

export class ServerFilterContainer{
    filters: Array<ServerFilterWrapper> = [];
    addFilter(filter: ServerFilterWrapper){
        if(this.filters.length>0){
            this.filters[this.filters.length-1].nextFilter = filter;
        }
        this.filters.push(filter);
    }

    async executeFilters(request: any, response: any){
        if(this.filters.length>0){
            let filter =  this.filters[0];
            await filter.doFilter(request, response, async () => {
                filter.next(request, response)
            });
        }
        return;

    }
}