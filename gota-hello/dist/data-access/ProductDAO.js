"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../gota-dao/index");
const Product_1 = require("../models/Product");
class ProductDAO extends index_1.DAO {
    constructor() {
        super(Product_1.Product);
    }
}
exports.ProductDAO = ProductDAO;
//# sourceMappingURL=ProductDAO.js.map