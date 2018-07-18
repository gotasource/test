"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const gota_service_1 = require("../gota-service");
const gota_injection_1 = require("../gota-injection");
const CategoryDAO_1 = require("../data-access/CategoryDAO");
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const ProductDAO_1 = require("../data-access/ProductDAO");
let ProductService = class ProductService {
    constructor() { }
};
__decorate([
    gota_injection_1.Autowired,
    __metadata("design:typeinfo", {
        type: () => CategoryDAO_1.CategoryDAO
    })
], ProductService.prototype, "categoryDAO", void 0);
__decorate([
    gota_injection_1.Autowired,
    __metadata("design:typeinfo", {
        type: () => ProductDAO_1.ProductDAO
    })
], ProductService.prototype, "productDAO", void 0);
ProductService = __decorate([
    gota_service_1.Service({ path: '/product-service', models: [Category_1.Category, Product_1.Product] }),
    __metadata("design:typeinfo", {
        paramTypes: () => []
    })
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map