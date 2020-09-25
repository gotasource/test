import * as fs from "fs";
export class FileWrapper{
    public name:string;
    public type:string;
    public content: Buffer;
    constructor(fileName: string, contentType: string, content: Buffer) {
        this.name = fileName;
        this.type = contentType;
        this.content =content;
    }

}