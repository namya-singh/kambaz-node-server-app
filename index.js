import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

// ——————————————
// 1) MongoDB Connection
// ——————————————
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING ||
                          "mongodb+srv://namyasingh:Nomoney%4022@kambaz.gsnicet.mongodb.net/?retryWrites=true&w=majority&appName=Kambaz";

mongoose.connect(CONNECTION_STRING)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ——————————————
// 2) Express Setup
// ——————————————
const app = express();
app.use(express.json());

// ——————————————
// 3) CORS Setup
// ——————————————
const allowedOrigins = [
    'https://kambazz.netlify.app',
    'http://localhost:5173'
];

app.set("trust proxy", 1); // trust proxy for secure cookies

app.use(cors({
                 origin: function (origin, callback) {
                     console.log("🌐 Incoming origin:", origin);
                     if (!origin || allowedOrigins.includes(origin)) {
                         callback(null, true);
                     } else {
                         console.error("❌ Origin not allowed by CORS:", origin);
                         callback(new Error(`Not allowed by CORS: ${origin}`));
                     }
                 },
                 credentials: true,
             }));

// ——————————————
// 4) Session Setup
// ——————————————
const isProduction = process.env.NODE_ENV === "production";
const rawDomain = process.env.NODE_SERVER_DOMAIN || "";

const domain = isProduction
               ? new URL(rawDomain.startsWith("http") ? rawDomain : `https://${rawDomain}`).hostname
               : undefined;

app.use(session({
                    secret: process.env.SESSION_SECRET || "kambaz",
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        // domain,
                        secure: isProduction,
                        httpOnly: true,
                        sameSite: isProduction ? "none" : "lax",
                        maxAge: 24 * 60 * 60 * 1000, // 1 day
                    },
                    store: MongoStore.create({
                                                 mongoUrl: CONNECTION_STRING,
                                                 collectionName: "sessions",
                                             }),
                }));

app.use(session({ /* ... */ }));
console.log("--> Session middleware added."); // Confirm this log appears

// ADD THIS GLOBAL REQUEST LOGGER:
app.use((req, res, next) => {
    console.log(`--> Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});
// ——————————————
// 5) Routes
// ——————————————
console.log("--> Registering UserRoutes...");
UserRoutes(app);
console.log("--> UserRoutes registered."); // Confirm this log appears
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);

// ——————————————
// 6) Debug Route
// ——————————————
app.post('/api/debug', (req, res) => {
    console.log('🔐 Cookie:', req.headers.cookie);
    console.log('🧠 Session:', req.session);
    res.json({
                 cookie: req.headers.cookie,
                 session: req.session,
                 currentUser: req.session.currentUser || null,
             });
});

// ——————————————
// 7) Start Server
// ——————————————
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
});










