"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const loggin_1 = __importDefault(require("./src/utils/loggin"));
const enum_1 = require("./src/utils/enum");
const router_1 = require("./src/auth/router");
const router_2 = require("./src/user/router");
const router_3 = require("./src/all_course/router");
const router_4 = require("./src/youtube_courses/router");
const router_5 = require("./src/news_letter/router");
const router_6 = require("./src/payment/router");
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 8081;
const StartServer = () => {
    app.use((req, res, next) => {
        loggin_1.default.info(`Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            // Log the Response
            loggin_1.default.info(`Incomming ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`);
        });
        next();
    });
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Cors
    app.use((0, cors_1.default)({
        origin: ["http://127.0.0.1:5500", "http://localhost:3000", "https://uche-crypt.vercel.app"],
        credentials: true,
    }));
    // Routes
    app.use("/api/v1", router_1.AuthRouter, router_2.UserRouter, router_3.AllCoursesRouter, router_4.YoutubeCoursesRouter, router_5.NewsLetterRouter, router_6.PaymentRouter);
    // Health check
    app.get("/api/v1/healthcheck", (_req, res) => {
        res.status(200).json({ status: "UP 🔥🔧🎂" });
    });
    // Invalid url error handling
    app.use((_req, res) => {
        const _error = new Error("Url not found 😟");
        loggin_1.default.error(_error);
        return res.status(404).json({ message: _error.message });
    });
    //error middleware
    app.use((err, _req, res, _next) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: enum_1.MessageResponse.Error,
                description: "Internal Server Error",
                data: null,
            });
        }
    });
    const server = app.listen(port, () => loggin_1.default.info(`Server is running on port ${port} 🔥🔧`));
};
const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    loggin_1.default.info(`Database connected 🎂`);
    StartServer();
})
    .catch((_error) => {
    loggin_1.default.error("Error while connecting to Database ===> ");
    loggin_1.default.error(_error);
    process.exit(1);
});
