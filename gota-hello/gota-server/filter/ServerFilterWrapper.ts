import {ServerFilter} from './ServerFilter'

export class ServerFilterWrapper{
    filter: ServerFilter;
    nextFilter: ServerFilterWrapper;
    constructor(filter: ServerFilter){
        this.filter = filter;
    }

    async doFilter(request: any, response: any, next: Function){
        if(!this.filter['paths'] || isMapped(request.url, this.filter['paths'])){
            await Promise.resolve(this.filter.doFilter(request, response, next));
        } else {
            await next(request, response);
        }

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

const isMapped = (path: string, mappingPath: string | Array<string>) => {

    if(Array.isArray(mappingPath)){
        const result = mappingPath.find(map => isMapped(path, map.toString()));
        return !! result;
    }else {
        if(path.indexOf('?')>0){
            path = path.substring(0, path.indexOf('?'))
        }

        const pathItems = path.split('/');
        if(pathItems[0]===''){
            pathItems.shift();
        }
        const mappingPathItems = mappingPath.split('/');
        if(mappingPathItems[0]===''){
            mappingPathItems.shift();
        }
        if(pathItems.length >= mappingPathItems.length){
            for (let index in mappingPathItems){
                if(mappingPathItems[index].startsWith(':')){
                    continue
                } else if(mappingPathItems[index] !== pathItems[index]){
                    return false;
                }

            }
            return true;
        }else {
            return false;
        }
    }
}