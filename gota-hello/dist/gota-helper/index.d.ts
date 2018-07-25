export declare class RequestMethod {
    static OPTIONS: string;
    static GET: string;
    static POST: string;
    static PUT: string;
    static PATCH: string;
    static DELETE: string;
}
export default class Helper {
    static getArguments: Function;
    static findSuper: Function;
    static findDeclaredProperties: (clazz: Function) => {
        name: string;
        type: Function;
    }[];
    static collectSchema: (clazz: Function) => {
        name: String;
        properties: {
            name: String;
            type: String;
        }[];
    }[];
}
