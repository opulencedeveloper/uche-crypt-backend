"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
exports.NewsLetterRouter = (0, express_1.Router)();
exports.NewsLetterRouter.post("/newsletter", [validator_1.newsLetterValidator.postNewsLetter], (0, utils_1.wrapAsync)(controller_1.newsLetterController.postNewsLetter));
