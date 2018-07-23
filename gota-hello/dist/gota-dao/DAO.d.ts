/// <reference path="Model.d.ts" />
import { Collection } from 'mongodb';
import { Model } from "./Model";
export declare class DAO<T extends Model> {
    private connection;
    private collectionName;
    protected collection: Collection;
    constructor(clazz: Function);
    initCollection(): Promise<void>;
    private cleanNullValue(t);
    private isEmptyObject(t);
    create(t: T): Promise<string>;
    createChild(parentId: string, childProperty: string, child: Object): Promise<boolean>;
    read(id: string): Promise<T>;
    update(id: string, updatingProperties: Object): Promise<boolean>;
    updateChild(parentId: string, childProperty: string, childQuery: Object, updatingProperties: Object): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    createMany(array: Array<T>): Promise<Array<string>>;
    search(query?: Object): Promise<Array<T>>;
    updateMany(query: Object, updatingProperties: Object): Promise<{
        ok: number;
        n: number;
    }>;
    deleteMany(query?: Object): Promise<{
        ok: number;
        n: number;
    }>;
}
