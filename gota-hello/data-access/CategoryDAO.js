import { Category } from "../models/Category";
import { DAO } from "./DAO";
export class CategoryDAO extends DAO {
    constructor() {
        super(Category);
    }
}
