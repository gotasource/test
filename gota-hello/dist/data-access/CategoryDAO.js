"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = require("../models/Category");
const index_1 = require("../gota-dao/index");
class CategoryDAO extends index_1.DAO {
    constructor() {
        super(Category_1.Category);
    }
}
exports.CategoryDAO = CategoryDAO;
//# sourceMappingURL=CategoryDAO.js.map