import 'reflect-metadata';
export declare class RequestMethod {
    static OPTIONS: string;
    static GET: string;
    static POST: string;
    static PUT: string;
    static PATCH: string;
    static DELETE: string;
}
export declare function Entity(properties: Array<{
    name: string;
    type: Function;
}>): (...args: any[]) => void;
