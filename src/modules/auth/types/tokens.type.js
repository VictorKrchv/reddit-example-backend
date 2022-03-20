"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Tokens = void 0;
var swagger_1 = require("@nestjs/swagger");
var Tokens = /** @class */ (function () {
    function Tokens() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], Tokens.prototype, "access_token");
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], Tokens.prototype, "refresh_token");
    return Tokens;
}());
exports.Tokens = Tokens;
