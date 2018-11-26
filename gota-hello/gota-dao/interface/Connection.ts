export interface Connection {
    // open():Promise<void>;
   createCollection(collectionName:string):Promise<any>;
}