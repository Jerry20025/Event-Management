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
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // Import cookie-parser
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const eventRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
eventRouter.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
eventRouter.use(express_1.default.json());
eventRouter.use((0, cookie_parser_1.default)()); // Use cookie-parser to parse cookies
const createEvent = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    date: zod_1.default.string(), // This validation allows simple date strings, but Prisma expects DateTime
});
const updateEvent = zod_1.default.object({
    title: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    date: zod_1.default.string().optional(),
});
//@ts-ignore
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Request cookies:", req.cookie); // Log all cookies
        const token = req.cookies.token;
        // console.log("Token from cookie:", token);
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, "hello_world");
        //@ts-ignore
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
});
eventRouter.post('/create', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, date } = createEvent.parse(req.body);
        // Parse the date string (assuming format: DD-MM-YYYY)
        const [year, month, day] = date.split('-').map(Number); // Convert strings to numbers
        const isoDate = new Date(year, month - 1, day).toISOString(); // Month is zero-indexed
        console.log(isoDate);
        const event = yield prisma.event.create({
            data: {
                title,
                description,
                date: isoDate,
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        });
        res.json(event);
    }
    catch (error) {
        console.error('Date parsing error:', error);
        res.status(400).json({ error: "Invalid date format. Please use DD-MM-YYYY format." });
    }
}));
eventRouter.delete('/delete/:id', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: "Invalid event ID" });
        const event = yield prisma.event.findUnique({
            where: { id }
        });
        if (!event)
            return res.status(404).json({ error: "Event not found" });
        yield prisma.event.delete({
            where: { id }
        });
        res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
eventRouter.get('/allevent', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield prisma.event.findMany({
        where: { userId: req.user.id }
    });
    if (!events)
        return res.status(404).json({ error: "No events found" });
    res.status(200).json(events);
}));
eventRouter.get('/event/:id', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid event ID" });
    const event = yield prisma.event.findUnique({
        where: { id }
    });
    if (!event)
        return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
}));
eventRouter.put('/update/:id', authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date } = updateEvent.parse(req.body);
    let isoDate;
    if (date) {
        const [year, month, day] = date.split('-').map(Number); // Convert strings to numbers
        isoDate = new Date(year, month - 1, day).toISOString(); // Month is zero-indexed
        console.log(isoDate);
    }
    console.log(isoDate);
    console.log(date);
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: "Invalid event ID" });
    const event = yield prisma.event.update({
        where: { id },
        data: {
            title,
            description,
            date: isoDate ? isoDate : undefined
        }
    });
    res.status(200).json(event);
}));
exports.default = eventRouter;
