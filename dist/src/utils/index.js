"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_otp = exports.slugify = exports.wrapAsync = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Middleware function to wrap controllers with try-catch
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.wrapAsync = wrapAsync;
//Convert all uppercase letters to lowercase and replace all spaces with dashed "-"
const slugify = (input) => {
    return input.toLowerCase().replace(/\s+/g, '-');
};
exports.slugify = slugify;
const generate_otp = () => {
    return Array.from({ length: 4 }, () => crypto_1.default.randomInt(0, 10)).join('');
};
exports.generate_otp = generate_otp;
