import 'reflect-metadata';
export declare class RequestMethod {
    static OPTIONS: string;
    static GET: string;
    static POST: string;
    static PUT: string;
    static PATCH: string;
    static DELETE: string;
}
export declare function Service(mapping: {
    name?: string;
    path: string | Array<string>;
    config?: object;
    models?: Array<any>;
}): (...args: any[]) => void;
export declare function Config(configKey?: string): (target: any, property: string) => void;
export declare function Autowired(target: any, property: string): void;
export declare function PostInit(target: any, property: string): void;
export declare function ServiceMapping(mapping: {
    name?: string;
    path: string | Array<string>;
    requestMethod?: string | Array<string>;
}): (...args: any[]) => void;
export declare function PathParameter(target: Object, name: string | symbol, index: number): void;
export declare function Query(target: Object, name: string | symbol, index: number): void;
export declare function QueryParameter(target: any, name: string | symbol, index: number): void;
export declare function Body(target: Object, name: string | symbol, index: number): void;
export declare function BodyParameter(target: Object, name: string | symbol, index: number): void;
export declare function Headers(target: Object, name: string | symbol, index: number): void;
export declare function HeadersParameter(target: Object, name: string | symbol, index: number): void;
export declare function Request(target: Object, name: string | symbol, index: number): void;
export declare function Response(target: Object, name: string | symbol, index: number): void;
