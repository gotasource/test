import {DAO} from "../gota-dao/index";
import {Product} from "../models/Product";

export class ProductDAO extends DAO<Product> {
    constructor() {
        super(Product);
    }
}