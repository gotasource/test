import {ServerFilterWrapper} from './ServerFilterWrapper'

export class ServerFilterContainer{
    private filters: Array<ServerFilterWrapper> = [];

    // public addFirst(filter: ServerFilterWrapper){
    //     if(this.filters.length>0){
    //         filter.nextFilter = this.filters[0];
    //     }
    //     this.filters.unshift(filter);
    // }

    public add(filter: ServerFilterWrapper){
        if(this.filters.length>0){
            this.filters[this.filters.length-1].nextFilter = filter;
        }
        this.filters.push(filter);
    }

    public async executeFilters(request: any, response: any){
        if(this.filters.length>0){
            let filter: ServerFilterWrapper =  this.filters[0];
            await filter.doFilter(request, response, async () => {
                await filter.next(request, response)
            });
        }
        return;

    }
}