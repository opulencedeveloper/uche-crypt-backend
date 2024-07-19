"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const newsLetterSchema = new Schema({
    email: {
        type: String,
        require,
    },
});
const NewsLetter = mongoose_1.default.model("NewsLetter", newsLetterSchema);
exports.default = NewsLetter;
