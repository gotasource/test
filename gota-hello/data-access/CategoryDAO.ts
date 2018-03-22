import {Category} from "../models/Category";
import {DAO} from "./DAO";

export class CategoryDAO extends DAO<Category> {
    constructor() {
        super(Category);
    }
}