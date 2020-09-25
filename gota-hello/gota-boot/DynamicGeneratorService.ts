import {Helper} from '../gota-core';
import {beanContext} from '../gota-injection';
import {Model} from '../gota-dao';
import {DataAccess} from '../gota-dao/interface/DataAccess';

const DESIGN_META_DATA = {
    APP: 'design:meta:data:key:app',
    CONFIG: 'design:meta:data:key:config',
    SERVICE: 'design:meta:data:key:service',
    AUTOWIRED: 'design:meta:data:key:autowired',
    SERVICE_MAPPING: 'design:meta:data:key:service:mapping',
    PATH: 'design:meta:data:key:path',
    METHOD: 'design:meta:data:key:method',
    PARAMETER: 'design:meta:data:key:parameter',
    PATH_PARAMETER: 'design:meta:data:key:path:parameter',
    REQUEST: 'design:meta:data:key:request',
    RESPONSE: 'design:meta:data:key:response',
    QUERY: 'design:meta:data:key:query',
    QUERY_PARAMETER: 'design:meta:data:key:query:parameter',
    BODY: 'design:meta:data:key:body',
    BODY_PARAMETER: 'design:meta:data:key:body:parameter',
    HEADERS: 'design:meta:data:key:headers',
    HEADERS_PARAMETER: 'design:meta:data:key:headers:parameter',
    DAO_OF_MODEL: 'design:meta:data:key:dao:of:model',
    MODEL_OF_DAO: 'design:meta:data:key:model:of:dao'
};


export class DynamicGeneratorService {
    private dao: DataAccess<any>;

    constructor(model: new(...args: any[]) => Model) {
        let daoType = Reflect.getMetadata(DESIGN_META_DATA.DAO_OF_MODEL, model);
        this.dao = beanContext.getBean(daoType.name);
    }

    public async search(query) {
        query = Helper.flatProperties(query);
        query = Helper.regexFormat(query);
        let t = await this.dao.search(query);
        return t;
    }

    public async read(id) {
        let t = await this.dao.read(id);
        return t;
    }

    public async create(body) {
        let _id;
        if (Array.isArray(body)) {
            _id = await this.dao.createMany(body);
        } else {
            _id = await this.dao.create(body);
        }
        return {_id: _id};
    }

    public async update(id, body) {
        let result = await this.dao.update(id, body);
        return {result: result};
    }

    public async updateMany(query, body) {
        let result = await this.dao.updateMany(query, body);
        return {result: result};
    }

    public async delete(id) {
        let result = await this.dao.delete(id);
        return {result: result};
    }

    public async createChild(id, query, body) {
        let result;
        if (query && Object.keys(query).find(key => query[key] == '$')) {// user.address=$ <= add a address property
            let childProperty = Object.keys(query).find(key => query[key] == '$');
            result = await this.dao.createChild(id, childProperty, body);
        }
        return {result: result};
    }

    public async updateChild(id, query, body) {
        let result;// Todo
        if (query && Object.keys(query).find(key => query[key] == '$')) {
            let childProperty = Object.keys(query).find(key => query[key] == '$');
            let childQuery = Object.assign(query);
            childQuery[childProperty] = undefined;
            result = await this.dao.updateChild(id, childProperty, childQuery, body);
        }

        return {result: result};
    }


}
