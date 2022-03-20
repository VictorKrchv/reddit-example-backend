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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var AuthService = /** @class */ (function () {
    function AuthService(userService, jwtService, sessionRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.sessionRepository = sessionRepository;
    }
    AuthService.prototype.getTokens = function (userId, email) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, _a, access_token, refresh_token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        payload = { sub: userId, email: email };
                        return [4 /*yield*/, Promise.all([
                                this.jwtService.signAsync(payload, {
                                    secret: process.env.JWT_SECRET_KEY,
                                    expiresIn: process.env.ACCESS_EXPIRES_IN
                                }),
                                this.jwtService.signAsync(payload, {
                                    secret: process.env.JWT_SECRET_KEY,
                                    expiresIn: process.env.REFRESH_EXPIRES_IN
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), access_token = _a[0], refresh_token = _a[1];
                        return [4 /*yield*/, this.updateRtHash(userId, refresh_token)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { access_token: access_token, refresh_token: refresh_token }];
                }
            });
        });
    };
    AuthService.prototype.updateRtHash = function (userId, rt) {
        return __awaiter(this, void 0, void 0, function () {
            var session, session_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sessionRepository.findOne({ userId: userId })];
                    case 1:
                        session = _a.sent();
                        if (!session) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sessionRepository.update({ id: session.id }, { refreshToken: rt })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        session_1 = this.sessionRepository.create({
                            userId: userId,
                            refreshToken: rt
                        });
                        return [4 /*yield*/, this.sessionRepository.save(session_1)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var user, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validateUser(credentials)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.getTokens(user.id, user.email)];
                    case 2:
                        tokens = _a.sent();
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    AuthService.prototype.validateUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var storedUser, isPasswordCorrect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findUserByEmail(user.email)];
                    case 1:
                        storedUser = _a.sent();
                        if (!storedUser) {
                            throw new common_1.ForbiddenException('Access denied');
                        }
                        return [4 /*yield*/, bcrypt.compare(user.password, storedUser.password)];
                    case 2:
                        isPasswordCorrect = _a.sent();
                        if (!isPasswordCorrect) {
                            throw new common_1.ForbiddenException('Access denied');
                        }
                        return [2 /*return*/, storedUser];
                }
            });
        });
    };
    AuthService.prototype.refreshTokens = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, email, refreshToken, session, isMatch, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = params.userId, email = params.email, refreshToken = params.refreshToken;
                        return [4 /*yield*/, this.sessionRepository.findOne({ refreshToken: refreshToken })];
                    case 1:
                        session = _a.sent();
                        if (!session) {
                            throw new common_1.ForbiddenException('Access denied');
                        }
                        isMatch = session.refreshToken === refreshToken;
                        if (!isMatch) {
                            throw new common_1.ForbiddenException('Access denied');
                        }
                        return [4 /*yield*/, this.getTokens(userId, email)];
                    case 2:
                        tokens = _a.sent();
                        return [2 /*return*/, tokens];
                }
            });
        });
    };
    AuthService.prototype.logout = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sessionRepository["delete"]({ userId: userId })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
