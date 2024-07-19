"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const allCoursesSchema = new Schema({
    video_url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    details: {
        type: [String],
        required: true,
    },
    introduction: {
        type: String,
        required: true,
    },
    course_content: [
        {
            title: {
                type: String,
                required: true,
            },
            modules: [
                {
                    video_url: {
                        type: String,
                        required: true,
                    },
                    title: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    ],
});
const AllCourse = mongoose_1.default.model("AllCourse", allCoursesSchema);
exports.default = AllCourse;
