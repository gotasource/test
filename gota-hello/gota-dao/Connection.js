var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from 'mongodb';
import { Config, PostInit } from '../gota-service';
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Connection {
    constructor() {
        this.collectionPool = {};
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Connection.db) {
                // while(!Connection.databaseConfig){
                //     await delay(1000);
                // }
                let host = this.databaseConfig.host;
                let port = this.databaseConfig.port;
                let databaseName = this.databaseConfig.databaseName;
                let url = `mongodb://${host}:${port}/`;
                try {
                    this.mongoClient = yield MongoClient.connect(url);
                    Connection.db = this.mongoClient.db(databaseName);
                }
                catch (err) {
                    console.log("Create Connection is Failed.\nPlease check database config: \n" + JSON.stringify(this.databaseConfig, null, 4));
                    throw err;
                }
            }
        });
    }
    createCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.open();
            // while(!Connection.db){
            //     await delay(1000);
            // }
            if (!this.collectionPool[collectionName]) {
                try {
                    let collection = Connection.db.collection(collectionName);
                    this.collectionPool[collectionName] = collection;
                }
                catch (err) {
                    console.log("createCollection is Failed: " + JSON.stringify(err, null, 4));
                    throw err;
                }
            }
            return this.collectionPool[collectionName];
        });
    }
}
__decorate([
    Config('database')
], Connection.prototype, "databaseConfig", void 0);
__decorate([
    PostInit
], Connection.prototype, "open", null);
export { Connection };
