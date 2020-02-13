import {MongoDataAccess} from "../gota-dao/index";
import {Product} from "../models/Product";
import {DAO} from '../gota-dao';

@DAO(Product)
export class ProductDAO extends MongoDataAccess<Product> {
    constructor() {
        super(Product);
    }
}