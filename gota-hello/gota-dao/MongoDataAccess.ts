/// <reference path="./Model.ts" />

//https://blogs.msdn.microsoft.com/typescript/2015/11/03/what-about-asyncawait/
//https://github.com/Microsoft/TypeScript/issues/204

import {Collection, ObjectId} from 'mongodb';

import {PostInit} from "../gota-core/index";
import {Autowired} from "../gota-injection/index";

import {MongoConnection} from "./MongoConnection";
import { DataAccess } from "./interface/DataAccess";
import {Model} from "./Model";

//let CollectionsPool
export class MongoDataAccess<T extends Model> implements DataAccess<Model> {
    @Autowired
    private connection: MongoConnection;
    private collectionName: string;
    protected collection: Collection;
    constructor(clazz?: Function) {
        if(clazz){
            this.collectionName = clazz.name.replace(/[A-Z]/g, (match, offset, string) => {
                return (offset ? '_' : '') + match.toLowerCase();
            });
        }
        
    }

    @PostInit
    public async initCollection(): Promise<void>{
        try {
            this.collection = await this.connection.createCollection(this.collectionName);
            console.log(`Created Collection: ${this.collectionName}`);
        }catch(err ){
            console.log(`Create Collection: ${this.collectionName} is Failed.`);
            throw err;
        }
    }

    private cleanNullValue(t: Object):object{
        let result={};
        Object.keys(t).forEach(key=>{
            if(t[key]===null ||  t[key]=== undefined){
                result[key]='';
                delete t[key];
            }
        });
        return result;
    }

    private isEmptyObject(t: Object):boolean{
        return Object.keys(t).length === 0
    }

    /**
     * Create a document in database
     * @param t  document
     * @returns  id of the created document.
     */
    async create(t: T): Promise<T>{
        // if(!t._id){
        //     t._id= (new ObjectId()).toString();
        // }
        let collection = this.collection;
        console.log('Creating "%s": %s', collection.collectionName, JSON.stringify(t, null, 4));
        this.cleanNullValue(t);
        let result;
        try{
            // Type 'Model' is not assignable to type '{ _id?: ObjectId; }'.
            // @ts-ignore
            result = await collection.insertOne(t, {w:1});
        }catch (err){
            if(err.code = 11000 && err.message.includes(' index: _id_ dup key: {')){//E11000 duplicate key error
                if(!isNaN(t._id as any)){
                    t._id = String(Number(t._id)+1);
                }else{
                    t._id = undefined;
                }

                return await this.create(t);
            }else{
                console.log('Creating is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }

        }
        //console.log('Creating is Success: %s', JSON.stringify(result.result, null, 4));
        return {_id: result.insertedId} as T;
    };

    /**
     * Add a child document to root document
     * @param  parentId  id of root document
     * @param  childProperty
     * @param  child  data of child
     * @returns  true if the command executed correctly
     */
    async createChild(parentId: string, childProperty:string, child: Object): Promise<boolean>{
        let collection = this.collection;
        console.log(`Creating child ${childProperty} of ${collection.collectionName} - id: ${parentId}`);
        console.log(`Value: ${ JSON.stringify(child, null, 4)}`);

        let query = {
            _id:parentId
        }

        let updatingObject = {$push:{}}
        updatingObject['$push'][childProperty] = child;
        let result;
        try{
            result = await collection.updateMany(query, updatingObject, {w:1});
        }catch (err){
            console.log('Updating Many is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        }
        return  result.result.ok === 1; // Todo
    };

    /**
     * Read a document
     * @param  id of document
     * @returns  document
     */
    async read(id: string): Promise<T>{
        let collection = this.collection;
        console.log('Reading "%s" id: %s', collection.collectionName, id);
        let t: T;
        try{
            let objectId = undefined;
            try {
                objectId = new ObjectId(id);
            }catch (err){

            }
            if(objectId){
                t = await collection.findOne({
                    $or: [
                        {'_id': id},
                        {'_id':new ObjectId(id)}
                    ]});
            }else {
                t = await collection.findOne({'_id': id});
            }

        }catch (err){
            console.log('Reading is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        };

        return t;
    };

    /**
     * Update properties of document
     * @param  id of document
     * @param  updatingProperties
     * @returns  true if the command executed correctly
     */
    async update(id: string, updatingProperties: Object): Promise<boolean>{
        let collection = this.collection;
        console.log('Updating "%s":\n\tid: %s\n\tproperties: %s', collection.collectionName, id, JSON.stringify(updatingProperties, null, 4));
        let unset  = this.cleanNullValue(updatingProperties);
        let set = updatingProperties;

        let updatingObject={};

        if(!this.isEmptyObject(set)){
            updatingObject = Object.assign(updatingObject, {$set: set})
        }
        if(!this.isEmptyObject(unset)){
            updatingObject = Object.assign(updatingObject, {$unset: unset})
        }

        if(!this.isEmptyObject(updatingObject)){
            let result;
            try{
                let objectId = undefined;
                try {
                    objectId = new ObjectId(id);
                }catch (err){

                }
                if(objectId){
                    result = await collection.updateOne({
                        $or: [
                            {'_id': id},
                            {'_id':new ObjectId(id)}
                        ]},  updatingObject, {w:1});
                }else {
                    //https://docs.mongodb.com/manual/reference/operator/update/unset/
                    //https://stackoverflow.com/questions/17760741/how-to-use-unset-and-set-in-combination-in-mongodb
                    result = await collection.updateOne({'_id':/*new ObjectID(*/id/*)*/}, updatingObject, {w:1});
                }


            }catch (err){
                console.log('Updating is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return  result.result && result.result.ok===1;
        }else{
            return true;
        }
    }

    /**
     * Update properties of child document in a root document
     * @param  parentId of root document
     * @param childProperty property will be changed
     * @param childQuery query condition ({$index:<number>} if update update child at <number>)
     * @returns  true if the command executed correctly
     */
    async updateChild(parentId: string, childProperty:string, childQuery:Object, updatingProperties: Object): Promise<boolean>{
        let collection = this.collection;
        //console.log('Updating "%s":\n\tid: %s\n\tproperties: %s', collection.collectionName, id, JSON.stringify(updatingProperties, null, 4));
        //https://docs.mongodb.com/manual/reference/operator/update/positional/
        let newChildQuery = {};
        let index = childQuery['$index'];
        childQuery['$index'] = undefined;

        Object.keys(childQuery).forEach(key => {
            newChildQuery[`${childProperty}.${key}`]= childQuery[key];
        });
        this.cleanNullValue(newChildQuery);


        let newUpdatingProperties = {}
        Object.keys(updatingProperties).forEach(key => {
            if(index) {
                newUpdatingProperties[`${childProperty}.${index}.${key}`] = updatingProperties[key];
            }else {
                newUpdatingProperties[`${childProperty}.$.${key}`] = updatingProperties[key];
            }
        });


        updatingProperties = newUpdatingProperties;
        let unset  = this.cleanNullValue(updatingProperties);
        let set = updatingProperties;

        let updatingObject={};
        if(!this.isEmptyObject(set)){
            updatingObject = Object.assign(updatingObject, {$set: set})
        }
        if(!this.isEmptyObject(unset)){
            updatingObject = Object.assign(updatingObject, {$unset: unset})
        }


        if(!this.isEmptyObject(updatingObject)){
            let result;
            try{
                let objectId = undefined;
                try {
                    objectId = new ObjectId(parentId);
                }catch (err){

                }


                if(objectId){

                    let query = Object.assign({
                        $or: [
                            {'_id': parentId},
                            {'_id': objectId}
                        ]},newChildQuery);
                    result = await collection.updateOne(query,  updatingObject, {w:1});
                }else {
                    let query = Object.assign({'_id': parentId}, newChildQuery);
                    //https://docs.mongodb.com/manual/reference/operator/update/unset/
                    //https://stackoverflow.com/questions/17760741/how-to-use-unset-and-set-in-combination-in-mongodb
                    result = await collection.updateOne(query, updatingObject, {w:1});
                }


            }catch (err){
                console.log('Updating is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return  result.result && result.result.ok===1;
        }else{
            return true;
        }
    }

    /**
     * Delete a document
     * @param  id of document
     * @returns  true if the command executed correctly
     */
    async delete(id: string): Promise<boolean>{
        let collection = this.collection;
        console.log('Deleting "%s" id: %s', collection.collectionName, id);
        let result;
        try{
            let objectId = undefined;
            try {
                objectId = new ObjectId(id);
            }catch (err){

            }
            if(objectId){
                result = await collection.deleteOne({
                    $or: [
                        {'_id': id},
                        {'_id':new ObjectId(id)}
                    ]
                }, {w: 1});
            }else {
                result = await collection.deleteOne({'_id': /*new ObjectID(*/id/*)*/}, {w: 1});
            }
        }catch (err){
            console.log('Deleting is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        }
        return  result.result && result.result.ok===1;
    }

    /**
     * Create Many documents
     * @param  array documents will be created
     * @returns  ids of created documents
     */
    async createMany(array: Array<T>): Promise<Array<T>>{
        let collection = this.collection;
        console.log('Creating Many "%s"', collection.collectionName);
        array.forEach(t=>{
            this.cleanNullValue(t);
        })
        let result;
        try{
            result = await collection.insertMany(array, {w:1});
        }catch (err){
            console.log('Creating Many is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        }
        return result.insertedIds.map(_id => new Object(({_id, id: _id}) as T));
    };

    /**
     * Search documents
     * @param  query condition
     * @returns  documents
     */
    async search(query?: Object): Promise<Array<T>>{
        let collection = this.collection;
        console.log('Finding "%s"',  collection.collectionName);
        let array;
        try{
            array = await collection.find(query).toArray();
        }catch (err){
            console.log('Finding is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        }
        return array;
    }

    /**
     * Search documents
     * @param  query condition
     * @returns  documents
     */
    async updateMany(query: Object, updatingProperties: Object): Promise<{ ok: number, n: number }>{
        let collection = this.collection;
        console.log('Updating Many "%s": %s', collection.collectionName, JSON.stringify(updatingProperties, null, 4));
        let unset  = this.cleanNullValue(updatingProperties);
        let set = updatingProperties;

        let updatingObject={};

        if(!this.isEmptyObject(set)){
            updatingObject = Object.assign(updatingObject, {$set: set})
        }
        if(!this.isEmptyObject(unset)){
            updatingObject = Object.assign(updatingObject, {$unset: unset})
        }

        if(!this.isEmptyObject(updatingObject)){
            let result;
            try{
                result = await collection.updateMany(query, updatingObject, {w:1});
            }catch (err){
                console.log('Updating Many is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return  result.result;
        }else{
            return { ok: 1, n: 0 }
        }

    }

    async deleteMany(query?: Object): Promise<{ ok: number, n: number }>{
        let collection = this.collection;
        console.log('Deleting Many "%s" query: %s', collection.collectionName, query);
        let result;
        try{
            result = await collection.deleteMany(query, {w:1});
        }catch (err){
            console.log('Deleting Many is Fail: %s', JSON.stringify(err, null, 4));
            throw err;
        }
        return  result.result;
    }

}
