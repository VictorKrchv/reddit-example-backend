"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
var generate_random_number_1 = require("@shared/libs/generate-random-number");
var date_fns_1 = require("date-fns");
var UsersService = /** @class */ (function () {
    function UsersService(userRepository, confirmUserCodesRepository, mailService) {
        this.userRepository = userRepository;
        this.confirmUserCodesRepository = confirmUserCodesRepository;
        this.mailService = mailService;
    }
    UsersService.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var hasUser, entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findUserByEmail(user.email)];
                    case 1:
                        hasUser = _a.sent();
                        if (hasUser) {
                            throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
                        }
                        entity = this.userRepository.create(user);
                        return [4 /*yield*/, this.userRepository.save(entity)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.findUserById = function (id) {
        return this.userRepository.findOne({ id: id });
    };
    UsersService.prototype.findUserByEmail = function (email) {
        return this.userRepository.findOne({ email: email });
    };
    UsersService.prototype.checkEmailForRegistration = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findUserByEmail(email)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, { exists: !!user, noValid: !(0, class_validator_1.isEmail)(email) }];
                }
            });
        });
    };
    UsersService.prototype.sendConfirmEmailCode = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var code, durationIsMinutes, expiredAt, entity, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = (0, generate_random_number_1.generateRandomNumber)();
                        durationIsMinutes = 15;
                        expiredAt = (0, date_fns_1.addMinutes)(new Date(), durationIsMinutes);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.mailService.sendEmail({
                                to: user.email,
                                subject: 'Подтверждение аккаунта.',
                                html: "\u041A\u043E\u0434 \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 ".concat(code, ". \u041A\u043E\u0434 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u0435\u043D \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 ").concat(durationIsMinutes, " \u043C\u0438\u043D\u0443\u0442.")
                            })];
                    case 2:
                        _a.sent();
                        entity = this.confirmUserCodesRepository.create({
                            userId: user.sub,
                            code: code,
                            expiredAt: expiredAt
                        });
                        return [4 /*yield*/, this.confirmUserCodesRepository.save(entity)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
