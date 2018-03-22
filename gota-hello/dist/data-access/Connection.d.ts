import { Db, Collection } from 'mongodb';
declare class Connection {
    private static databaseConfig;
    private static mongoClient;
    static db: Db;
    constructor();
    open1(): Db;
    static open(): Promise<Db>;
    static createCollection(collectionName: string): Promise<Collection>;
}
export { Connection };
