"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.SharedModule = void 0;
var common_1 = require("@nestjs/common");
var config_service_1 = require("./services/config.service");
var config_1 = require("@nestjs/config");
var mail_service_1 = require("./services/mail.service");
var providers = [config_service_1.ConfigService, mail_service_1.MailService];
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        (0, common_1.Global)(),
        (0, common_1.Module)({
            providers: providers,
            imports: [config_1.ConfigModule.forRoot()],
            exports: __spreadArray([], providers, true)
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
