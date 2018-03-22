/// <reference types="node" />
export declare class FileWrapper {
    name: string;
    type: string;
    content: Buffer;
    constructor(fileName: string, contentType: string, content: Buffer);
    saveFile(path: string): void;
}
export default class GotaServer {
    private mapping;
    private server;
    constructor();
    addMapping(path: any, method: any, args: any, execute: any, context: any): void;
    listen(port: any, hostname: any, callback: any): void;
}
