import {Category} from "../models/Category";
import {MongoDataAccess} from "../gota-dao/index";

export class CategoryDAO extends MongoDataAccess<Category> {
    constructor() {
        super(Category);
    }
}