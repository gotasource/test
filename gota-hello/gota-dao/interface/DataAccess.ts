
//let CollectionsPool
import {Model} from '../Model';

export interface DataAccess<T extends Model> {

    /**
     * Add a child document to root document
     * @param  parentId  id of root document
     * @param  childProperty
     * @param  child  data of child
     * @returns  true if the command executed correctly
     */
    createChild(parentId: string, childProperty:string, child: Object): Promise<boolean>;

    /**
     * Read a document
     * @param  id of document
     * @returns  document
     */
    read(id: string): Promise<T>;

    /**
     * Update properties of document
     * @param  id of document
     * @param  updatingProperties
     * @returns  true if the command executed correctly
     */
    update(id: string, updatingProperties: Object): Promise<boolean>;

    /**
     * Update properties of child document in a root document
     * @param  parentId of root document
     * @param childProperty property will be changed
     * @param childQuery query condition ({$index:<number>} if update update child at <number>)
     * @returns  true if the command executed correctly
     */
    updateChild(parentId: string, childProperty:string, childQuery:Object, updatingProperties: Object): Promise<boolean>;

    /**
     * Delete a document
     * @param  id of document
     * @returns  true if the command executed correctly
     */
    delete(id: string): Promise<boolean>;

    /**
     * Create Many documents
     * @param  array documents will be created
     * @returns  documents are included new properties
     */
    createMany(array: Array<T>): Promise<Array<T>>;

    /**
     * Search documents
     * @param  query condition
     * @returns  documents
     */
    search(query?: Object): Promise<Array<T>>;

    /**
     * Search documents
     * @param  query condition
     * @returns  documents
     */
    updateMany(query: Object, updatingProperties: Object): Promise<{ ok: number, n: number }>;

    deleteMany(query?: Object): Promise<{ ok: number, n: number }>;

}
