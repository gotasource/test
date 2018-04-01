import { Collection } from 'mongodb';
declare class Connection {
    private databaseConfig;
    private mongoClient;
    private static db;
    constructor();
    protected open(): Promise<void>;
    createCollection(collectionName: string): Promise<Collection>;
}
export { Connection };
