"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const entity_1 = __importDefault(require("../user/entity"));
const auth_1 = require("../utils/auth");
class AuthService {
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const hashedPassword = (yield (0, auth_1.hashPassword)(password));
            const user = new entity_1.default({
                email,
                password: hashedPassword,
            });
            const userData = yield user.save();
            return userData;
        });
    }
    save_otp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = input;
            const user = yield entity_1.default.findOne({
                email: email,
            });
            if (user) {
                user.email_verify_otp = otp;
                //3600000 is in milisecs and this is 1hr, so the token is valid for 1 hour
                user.email_verify_otp_expiration = new Date(Date.now() + 3600000);
                yield user.save();
            }
            return user;
        });
    }
    check_email_verification_status(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({ email, email_verified: true });
            return user;
        });
    }
    validate_otp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp_validity = yield entity_1.default.findOne({
                email: email,
                email_verify_otp: otp,
            });
            return otp_validity;
        });
    }
    delete_otp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({ email });
            if (user) {
                user.email_verify_otp = undefined;
                user.email_verify_otp_expiration = undefined;
                yield user.save();
            }
            return user;
        });
    }
    verify_email(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = input;
            const user = yield entity_1.default.findOne({ email });
            if (user) {
                user.email_verified = true;
                user.save();
            }
            return user;
        });
    }
    change_password(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield entity_1.default.findOne({ email });
            const hashedPassword = (yield (0, auth_1.hashPassword)(password));
            if (user) {
                user.password = hashedPassword;
                yield user.save();
            }
            return user;
        });
    }
}
exports.authService = new AuthService();
