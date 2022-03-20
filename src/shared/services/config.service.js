"use strict";
exports.__esModule = true;
exports.ConfigService = void 0;
var dotenv = require("dotenv");
var snake_naming_strategy_1 = require("@common/snake-naming.strategy");
var ConfigService = /** @class */ (function () {
    function ConfigService() {
        var nodeEnv = this.nodeEnv;
        dotenv.config({
            path: ".".concat(nodeEnv, ".env")
        });
        // Replace \\n with \n to support multiline strings in AWS
        for (var _i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
            var envName = _a[_i];
            process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
        }
    }
    Object.defineProperty(ConfigService.prototype, "isDevelopment", {
        get: function () {
            return this.nodeEnv === 'development';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConfigService.prototype, "isProduction", {
        get: function () {
            return this.nodeEnv === 'production';
        },
        enumerable: false,
        configurable: true
    });
    ConfigService.prototype.get = function (key) {
        return process.env[key];
    };
    ConfigService.prototype.getNumber = function (key) {
        return Number(this.get(key));
    };
    Object.defineProperty(ConfigService.prototype, "nodeEnv", {
        get: function () {
            return this.get('NODE_ENV') || 'development';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConfigService.prototype, "typeOrmConfig", {
        get: function () {
            var entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
            var migrations = [__dirname + '/../../migrations/*{.ts,.js}'];
            if (module.hot) {
                var entityContext_1 = require.context('./../../modules', true, /\.entity\.ts$/);
                entities = entityContext_1.keys().map(function (id) {
                    var entityModule = entityContext_1(id);
                    var entity = Object.values(entityModule)[0];
                    return entity;
                });
                var migrationContext_1 = require.context('./../../migrations', false, /\.ts$/);
                migrations = migrationContext_1.keys().map(function (id) {
                    var migrationModule = migrationContext_1(id);
                    var migration = Object.values(migrationModule)[0];
                    return migration;
                });
            }
            return {
                entities: entities,
                migrations: migrations,
                keepConnectionAlive: true,
                type: 'postgres',
                host: this.get('DB_HOST'),
                port: this.getNumber('DB_PORT'),
                username: this.get('DB_USERNAME'),
                password: this.get('DB_PASSWORD'),
                database: this.get('DB_DATABASE'),
                migrationsRun: false,
                namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
                logging: false,
                synchronize: true
            };
        },
        enumerable: false,
        configurable: true
    });
    return ConfigService;
}());
exports.ConfigService = ConfigService;
