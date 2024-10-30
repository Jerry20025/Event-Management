"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const event_1 = __importDefault(require("./routes/event"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    next();
});
app.use(express_1.default.json());
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/event', event_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
