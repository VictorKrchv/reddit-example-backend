"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var shared_module_1 = require("./shared/shared.module");
var typeorm_1 = require("@nestjs/typeorm");
var config_service_1 = require("./shared/services/config.service");
var users_module_1 = require("@modules/users/users.module");
var auth_module_1 = require("@modules/auth/auth.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
                shared_module_1.SharedModule,
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [shared_module_1.SharedModule],
                    useFactory: function (configService) { return configService.typeOrmConfig; },
                    inject: [config_service_1.ConfigService]
                }),
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
