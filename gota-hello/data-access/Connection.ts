 import {Server, Db, Collection, MongoClient} from 'mongodb';
 import {Config, PostInit} from '../gota-service';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Connection {
    @Config('database')
    private databaseConfig: any;
    private mongoClient: MongoClient;
    private static db: Db;
    constructor(){}
    @PostInit
    protected async open():Promise<void>{
        if(!Connection.db){
            // while(!Connection.databaseConfig){
            //     await delay(1000);
            // }
            let host = this.databaseConfig.host;
            let port = this.databaseConfig.port;
            let databaseName = this.databaseConfig.databaseName;
            let url = `mongodb://${host}:${port}/`;
            try{
                this.mongoClient = await MongoClient.connect(url);
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
        try{
            let collection:Collection = Connection.db.collection(collectionName);
            return collection;
        }catch(err) {
            console.log("createCollection is Failed: " + JSON.stringify(err, null, 4));
            throw  err;
        }
    }
}

export {Connection};