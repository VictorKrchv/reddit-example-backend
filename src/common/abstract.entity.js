'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AbstractEntity = void 0;
var typeorm_1 = require("typeorm");
var swagger_1 = require("@nestjs/swagger");
var AbstractEntity = /** @class */ (function () {
    function AbstractEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        (0, swagger_1.ApiProperty)()
    ], AbstractEntity.prototype, "id");
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, typeorm_1.CreateDateColumn)({
            type: 'timestamp without time zone',
            name: 'created_at'
        })
    ], AbstractEntity.prototype, "createdAt");
    __decorate([
        (0, swagger_1.ApiProperty)(),
        (0, typeorm_1.UpdateDateColumn)({
            type: 'timestamp without time zone',
            name: 'updated_at'
        })
    ], AbstractEntity.prototype, "updatedAt");
    return AbstractEntity;
}());
exports.AbstractEntity = AbstractEntity;
