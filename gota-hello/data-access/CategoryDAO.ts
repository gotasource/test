import {Category} from "../models/Category";
import {DAO} from "../gota-dao/index";

export class CategoryDAO extends DAO<Category> {
    constructor() {
        super(Category);
    }
}