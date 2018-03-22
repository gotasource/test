/// <reference path="../models/model.ts" />

//https://blogs.msdn.microsoft.com/typescript/2015/11/03/what-about-asyncawait/
//https://github.com/Microsoft/TypeScript/issues/204

import {Connection} from "./Connection";
import {Collection, ObjectId, Binary } from 'mongodb';
import {Model} from "../models/Model";
import {isUndefined} from "util";
import {create} from "domain";

let createCollection = async function(dao, collectionName){
    dao.collection = await Connection.createCollection(collectionName);
}
export class DAO<T extends Model> {
    private collection: Collection;
    private vv: Binary;
    constructor(clazz: Function){
        let collectionName = clazz.name.replace(/[A-Z]/g, (match, offset, string)=> {
            return (offset ? '_' : '') + match.toLowerCase();
        });
        Connection.createCollection(collectionName).then(result =>{
            this.collection = result
        }).catch((err) => {
            throw err
        });
    }
    // get collection():Collection{
    //     return Connection.getDataBase().collection(this.collectionName);
    // }

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

    async create(t: T): Promise<string>{
        // if(!t._id){
        //     t._id= (new ObjectId()).toString();
        // }
        let collection = this.collection;
        console.log('Creating "%s": %s', collection.collectionName, JSON.stringify(t, null, 4));
        this.cleanNullValue(t);
        let result;
        try{
            result = await collection.insertOne(t, {w:1});
        }catch (err){
            if(err.code = 11000 && err.message.includes(' index: _id_ dup key: {')){//E11000 duplicate key error
                if(!isNaN(t._id as any)){
                    t._id = String(Number(t._id)+1);
                }
                t._id = undefined;
                return await this.create(t);
            }else{
                console.log('Creating is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }

        }
        //console.log('Creating is Success: %s', JSON.stringify(result.result, null, 4));
        return result.insertedId ;
    };

    async createChild(parentId: string, childProperty:string, child: Object): Promise<string>{
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
        return  result.result;
    };

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

    async updateChild(parentId: string, childProperty:string, childQuery:Object, updatingProperties: Object): Promise<boolean>{
        let collection = this.collection;
        //console.log('Updating "%s":\n\tid: %s\n\tproperties: %s', collection.collectionName, id, JSON.stringify(updatingProperties, null, 4));

        let newUpdatingProperties = {}
        Object.keys(updatingProperties).forEach(key => {
            newUpdatingProperties[`${childProperty}.$.${key}`]= updatingProperties[key];
        });

        let newChildQuery = {};
        Object.keys(childQuery).forEach(key => {
            newChildQuery[`${childProperty}.${key}`]= childQuery[key];
        });
        this.cleanNullValue(newChildQuery);

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

    async createMany(array: Array<T>): Promise<Array<string>>{
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
        return result.insertedIds;
    };

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
