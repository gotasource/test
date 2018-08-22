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
    saveFile(path:string):void{
        fs.writeFile(path + (path.endsWith('/') ? '': '/') + this.name, this.content, "binary", function (err) {
            if (err) {
                //console.log(err);
                throw err;
            } else {
                //console.log("the file was saved!");
            }
        });
    }

}