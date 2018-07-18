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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gota_core_1 = require("../gota-core");
const gota_service_1 = require("../gota-service");
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sleep(contex, fn, args) {
    return __awaiter(this, void 0, void 0, function* () {
        yield timeout(3000);
        return fn.apply(contex, args);
    });
}
class User {
    constructor(firstName, lastName) {
        this.lastName = lastName;
        this.firstName = firstName;
    }
}
exports.User = User;
let Hello = class Hello {
    constructor() {
    }
    readCategory(lastName, firstName) {
        let user = new User(firstName, lastName);
        return user;
    }
    readCategory1(lastName, firstName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sleep(this, this.readCategory, [lastName, firstName]);
        });
    }
};
__decorate([
    gota_service_1.ServiceMapping({ path: ['/hi', '/hii'] }),
    __param(0, gota_service_1.QueryParameter), __param(1, gota_service_1.QueryParameter),
    __metadata("design:typeinfo", {
        type: () => Function,
        paramTypes: () => [String, String],
        returnType: () => User
    })
], Hello.prototype, "readCategory", null);
__decorate([
    gota_service_1.ServiceMapping({ requestMethod: [gota_service_1.RequestMethod.GET, gota_service_1.RequestMethod.PUT], path: '/bye' }), gota_core_1.AwaitedType(User),
    __param(0, gota_service_1.QueryParameter), __param(1, gota_service_1.QueryParameter),
    __metadata("design:typeinfo", {
        type: () => Function,
        paramTypes: () => [String, String],
        returnType: () => Promise
    })
], Hello.prototype, "readCategory1", null);
Hello = __decorate([
    gota_service_1.Service({ path: '/hello' }),
    __metadata("design:typeinfo", {
        paramTypes: () => []
    })
], Hello);
exports.Hello = Hello;
//# sourceMappingURL=Hello.js.map