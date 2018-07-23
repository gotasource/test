"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = require("./Connection");
const mongodb_1 = require("mongodb");
const index_1 = require("../gota-injection/index");
const index_2 = require("../gota-core/index");
class DAO {
    constructor(clazz) {
        this.collectionName = clazz.name.replace(/[A-Z]/g, (match, offset, string) => {
            return (offset ? '_' : '') + match.toLowerCase();
        });
    }
    initCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.collection = yield this.connection.createCollection(this.collectionName);
                console.log(`Created Collection: ${this.collectionName}`);
            }
            catch (err) {
                console.log(`Create Collection: ${this.collectionName} is Failed.`);
                throw err;
            }
        });
    }
    cleanNullValue(t) {
        let result = {};
        Object.keys(t).forEach(key => {
            if (t[key] === null || t[key] === undefined) {
                result[key] = '';
                delete t[key];
            }
        });
        return result;
    }
    isEmptyObject(t) {
        return Object.keys(t).length === 0;
    }
    create(t) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Creating "%s": %s', collection.collectionName, JSON.stringify(t, null, 4));
            this.cleanNullValue(t);
            let result;
            try {
                result = yield collection.insertOne(t, { w: 1 });
            }
            catch (err) {
                if (err.code = 11000 && err.message.includes(' index: _id_ dup key: {')) {
                    if (!isNaN(t._id)) {
                        t._id = String(Number(t._id) + 1);
                    }
                    t._id = undefined;
                    return yield this.create(t);
                }
                else {
                    console.log('Creating is Fail: %s', JSON.stringify(err, null, 4));
                    throw err;
                }
            }
            return result.insertedId;
        });
    }
    ;
    createChild(parentId, childProperty, child) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log(`Creating child ${childProperty} of ${collection.collectionName} - id: ${parentId}`);
            console.log(`Value: ${JSON.stringify(child, null, 4)}`);
            let query = {
                _id: parentId
            };
            let updatingObject = { $push: {} };
            updatingObject['$push'][childProperty] = child;
            let result;
            try {
                result = yield collection.updateMany(query, updatingObject, { w: 1 });
            }
            catch (err) {
                console.log('Updating Many is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return result.result.ok === 1;
        });
    }
    ;
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Reading "%s" id: %s', collection.collectionName, id);
            let t;
            try {
                let objectId = undefined;
                try {
                    objectId = new mongodb_1.ObjectId(id);
                }
                catch (err) {
                }
                if (objectId) {
                    t = yield collection.findOne({
                        $or: [
                            { '_id': id },
                            { '_id': new mongodb_1.ObjectId(id) }
                        ]
                    });
                }
                else {
                    t = yield collection.findOne({ '_id': id });
                }
            }
            catch (err) {
                console.log('Reading is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            ;
            return t;
        });
    }
    ;
    update(id, updatingProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Updating "%s":\n\tid: %s\n\tproperties: %s', collection.collectionName, id, JSON.stringify(updatingProperties, null, 4));
            let unset = this.cleanNullValue(updatingProperties);
            let set = updatingProperties;
            let updatingObject = {};
            if (!this.isEmptyObject(set)) {
                updatingObject = Object.assign(updatingObject, { $set: set });
            }
            if (!this.isEmptyObject(unset)) {
                updatingObject = Object.assign(updatingObject, { $unset: unset });
            }
            if (!this.isEmptyObject(updatingObject)) {
                let result;
                try {
                    let objectId = undefined;
                    try {
                        objectId = new mongodb_1.ObjectId(id);
                    }
                    catch (err) {
                    }
                    if (objectId) {
                        result = yield collection.updateOne({
                            $or: [
                                { '_id': id },
                                { '_id': new mongodb_1.ObjectId(id) }
                            ]
                        }, updatingObject, { w: 1 });
                    }
                    else {
                        result = yield collection.updateOne({ '_id': id }, updatingObject, { w: 1 });
                    }
                }
                catch (err) {
                    console.log('Updating is Fail: %s', JSON.stringify(err, null, 4));
                    throw err;
                }
                return result.result && result.result.ok === 1;
            }
            else {
                return true;
            }
        });
    }
    updateChild(parentId, childProperty, childQuery, updatingProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            let newChildQuery = {};
            let index = childQuery['$index'];
            childQuery['$index'] = undefined;
            Object.keys(childQuery).forEach(key => {
                newChildQuery[`${childProperty}.${key}`] = childQuery[key];
            });
            this.cleanNullValue(newChildQuery);
            let newUpdatingProperties = {};
            Object.keys(updatingProperties).forEach(key => {
                if (index) {
                    newUpdatingProperties[`${childProperty}.${index}.${key}`] = updatingProperties[key];
                }
                else {
                    newUpdatingProperties[`${childProperty}.$.${key}`] = updatingProperties[key];
                }
            });
            updatingProperties = newUpdatingProperties;
            let unset = this.cleanNullValue(updatingProperties);
            let set = updatingProperties;
            let updatingObject = {};
            if (!this.isEmptyObject(set)) {
                updatingObject = Object.assign(updatingObject, { $set: set });
            }
            if (!this.isEmptyObject(unset)) {
                updatingObject = Object.assign(updatingObject, { $unset: unset });
            }
            if (!this.isEmptyObject(updatingObject)) {
                let result;
                try {
                    let objectId = undefined;
                    try {
                        objectId = new mongodb_1.ObjectId(parentId);
                    }
                    catch (err) {
                    }
                    if (objectId) {
                        let query = Object.assign({
                            $or: [
                                { '_id': parentId },
                                { '_id': objectId }
                            ]
                        }, newChildQuery);
                        result = yield collection.updateOne(query, updatingObject, { w: 1 });
                    }
                    else {
                        let query = Object.assign({ '_id': parentId }, newChildQuery);
                        result = yield collection.updateOne(query, updatingObject, { w: 1 });
                    }
                }
                catch (err) {
                    console.log('Updating is Fail: %s', JSON.stringify(err, null, 4));
                    throw err;
                }
                return result.result && result.result.ok === 1;
            }
            else {
                return true;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Deleting "%s" id: %s', collection.collectionName, id);
            let result;
            try {
                let objectId = undefined;
                try {
                    objectId = new mongodb_1.ObjectId(id);
                }
                catch (err) {
                }
                if (objectId) {
                    result = yield collection.deleteOne({
                        $or: [
                            { '_id': id },
                            { '_id': new mongodb_1.ObjectId(id) }
                        ]
                    }, { w: 1 });
                }
                else {
                    result = yield collection.deleteOne({ '_id': id }, { w: 1 });
                }
            }
            catch (err) {
                console.log('Deleting is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return result.result && result.result.ok === 1;
        });
    }
    createMany(array) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Creating Many "%s"', collection.collectionName);
            array.forEach(t => {
                this.cleanNullValue(t);
            });
            let result;
            try {
                result = yield collection.insertMany(array, { w: 1 });
            }
            catch (err) {
                console.log('Creating Many is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return result.insertedIds;
        });
    }
    ;
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Finding "%s"', collection.collectionName);
            let array;
            try {
                array = yield collection.find(query).toArray();
            }
            catch (err) {
                console.log('Finding is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return array;
        });
    }
    updateMany(query, updatingProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Updating Many "%s": %s', collection.collectionName, JSON.stringify(updatingProperties, null, 4));
            let unset = this.cleanNullValue(updatingProperties);
            let set = updatingProperties;
            let updatingObject = {};
            if (!this.isEmptyObject(set)) {
                updatingObject = Object.assign(updatingObject, { $set: set });
            }
            if (!this.isEmptyObject(unset)) {
                updatingObject = Object.assign(updatingObject, { $unset: unset });
            }
            if (!this.isEmptyObject(updatingObject)) {
                let result;
                try {
                    result = yield collection.updateMany(query, updatingObject, { w: 1 });
                }
                catch (err) {
                    console.log('Updating Many is Fail: %s', JSON.stringify(err, null, 4));
                    throw err;
                }
                return result.result;
            }
            else {
                return { ok: 1, n: 0 };
            }
        });
    }
    deleteMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.collection;
            console.log('Deleting Many "%s" query: %s', collection.collectionName, query);
            let result;
            try {
                result = yield collection.deleteMany(query, { w: 1 });
            }
            catch (err) {
                console.log('Deleting Many is Fail: %s', JSON.stringify(err, null, 4));
                throw err;
            }
            return result.result;
        });
    }
}
__decorate([
    index_1.Autowired,
    __metadata("design:typeinfo", {
        type: () => Connection_1.Connection
    })
], DAO.prototype, "connection", void 0);
__decorate([
    index_2.PostInit,
    __metadata("design:typeinfo", {
        type: () => Function,
        paramTypes: () => [],
        returnType: () => Promise
    })
], DAO.prototype, "initCollection", null);
exports.DAO = DAO;
//# sourceMappingURL=DAO.js.map