"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SiteInfo_1 = require("../models/SiteInfo");
const index_1 = require("../gota-dao/index");
class SiteInfoDAO extends index_1.DAO {
    constructor() {
        super(SiteInfo_1.SiteInfo);
    }
}
exports.SiteInfoDAO = SiteInfoDAO;
//# sourceMappingURL=SiteInfoDAO.js.map