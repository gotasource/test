import {ServiceFilter} from "../../gota-server";

export class ServiceFilterTest1 implements ServiceFilter{
    async doFilter(request: any, response: any, next: Function) {
        console.log(">>>>ServiceFilterTest1")
        await next();
    }
}

export class ServiceFilterTest2 implements ServiceFilter{
    async doFilter(request: any, response: any, next: Function) {
        console.log(">>>>ServiceFilterTest2")
        await next();
    }
}