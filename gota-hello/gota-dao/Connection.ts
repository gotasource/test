 import {Server, Db, Collection, MongoClient} from 'mongodb';
 import {Config} from '../gota-injection/index';
 import {PostInit} from '../gota-core/index';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Connection {
    @Config('database')
    private databaseConfig: any;
    private mongoClient: MongoClient;
    private static db: Db;
    private collectionPool: Object = {};
    constructor(){}
    @PostInit
    protected async open():Promise<void>{
        if(!Connection.db){
             if(!this.databaseConfig){
                    let databaseFormat =
                    `
                    database: {
                        host: <host>,
                        port: <port>,
                        databaseName:<databaseName>
                    }
                    or
                     database: {
                        url: <url>
                    }
                    `;
                    throw new Error('\n\rDatabase config is not found or wrong format. please update database config with format: ' + databaseFormat);
                }
            let databaseName = this.databaseConfig.databaseName;
            let url = this.databaseConfig.url || `mongodb://${this.databaseConfig.host}:${this.databaseConfig.port}/`;
            try{
                this.mongoClient = await MongoClient.connect(url, { useNewUrlParser: true });
                Connection.db = this.mongoClient.db(databaseName);
            }catch (err){
                console.log("Create Connection is Failed.\nPlease check database config: \n" + JSON.stringify(this.databaseConfig, null, 4));
                throw err;
            }
        }
    }

    public async createCollection(collectionName:string):Promise<Collection>{
        // this.open();
        // while(!Connection.db){
        //     await delay(1000);
        // }
        if(!this.collectionPool[collectionName]){
            try{
                let collection:Collection = Connection.db.collection(collectionName);
                this.collectionPool[collectionName] = collection;
            }catch(err) {
                console.log("createCollection is Failed: " + JSON.stringify(err, null, 4));
                throw  err;
            }
        }
        return this.collectionPool[collectionName] as Collection;
    }
}

export {Connection};