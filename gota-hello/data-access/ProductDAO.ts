import {MongoDataAccess} from "../gota-dao/index";
import {Product} from "../models/Product";

export class ProductDAO extends MongoDataAccess<Product> {
    constructor() {
        super(Product);
    }
}