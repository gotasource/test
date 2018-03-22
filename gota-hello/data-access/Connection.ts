 import {Server, Db, Collection, MongoClient} from 'mongodb';
 import {Config, PostInit} from '../gota-service';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Connection {
    @Config('database')
    private static databaseConfig: any;
    private static mongoClient: MongoClient;
    public static db: Db;
    constructor(){}

    @PostInit
    public open1():Db{

        return Connection.db;
    }
    public static async open():Promise<Db>{
        if(!Connection.db){
            while(!Connection.databaseConfig){
                await delay(1000);
            }
            let host = this.databaseConfig.host;
            let port = this.databaseConfig.port;
            let databaseName = this.databaseConfig.databaseName;
            let url = `mongodb://${host}:${port}/`;
            try{
                Connection.mongoClient = await MongoClient.connect(url);
                Connection.db = Connection.mongoClient.db(databaseName);
            }catch (err){
                console.log("createConnection is Failed.\nPlease check database config: \n" + JSON.stringify(Connection.databaseConfig, null, 4));
                throw err;
            }
        }
        return Connection.db;
    }

    public static async createCollection(collectionName:string):Promise<Collection>{
        Connection.open();
        while(!Connection.db){
            await delay(1000);
        }
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