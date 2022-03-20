"use strict";
exports.__esModule = true;
exports.LocalAuthGuard = void 0;
var passport_1 = require("@nestjs/passport");
exports.LocalAuthGuard = (0, passport_1.AuthGuard)('jwt');
