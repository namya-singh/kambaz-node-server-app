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
                        domain,
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


// ——————————————
// 5) Routes
// ——————————————
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











//
//
// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
//
// import mongoose from "mongoose";
//
// import Hello from './Hello.js';
// import Lab5 from './Lab5/index.js';
// import UserRoutes from './Kambaz/Users/routes.js';
// import CourseRoutes from './Kambaz/Courses/routes.js';
// import ModuleRoutes from './Kambaz/Modules/routes.js';
// import AssignmentRoutes from './Kambaz/Assignments/routes.js';
// import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';
// const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb+srv://namyasingh:Nomoney@22@kambaz.gsnicet.mongodb.net/?retryWrites=true&w=majority&appName=Kambaz"
// mongoose.connect(CONNECTION_STRING);
//
//
// const app = express();
//
// // ——————————————
// // 1) CORS
// // ——————————————
// const allowedOrigins = [
//     // 'http://localhost:5173',
//     'https://kambazz.netlify.app',
// ];
//
//
// app.use(cors({
//                  origin: (origin, callback) => {
//                      console.log("🌐 Incoming origin:", origin);
//                      if (!origin || allowedOrigins.includes(origin)) {
//                          callback(null, true);
//                      } else {
//                          console.error("❌ Origin not allowed by CORS:", origin);
//                          callback(new Error(`Not allowed by CORS: ${origin}`));
//                      }
//                  },
//                  credentials: true,
//              }));
//
//
// // ——————————————
// // 2) SESSION
// // ——————————————
// // const sessionOptions = {
// //     secret: process.env.SESSION_SECRET || 'kambaz',
// //     resave: false,
// //     saveUninitialized: false,
// // };
// if (process.env.NODE_ENV !== "development") {
//     sessionOptions.proxy = true;
//     sessionOptions.cookie = {
//         sameSite: "none",
//         secure: true,
//         domain: process.env.NODE_SERVER_DOMAIN,
//     };
//
// }
// import session from "express-session";
// app.set("trust proxy", 1); // trust first proxy, set only if behind a proxy like Heroku, otherwise comment out
//
// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "kambaz",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: true,      // false for HTTP local dev; set true on HTTPS prod
//         httpOnly: true,     // good security practice
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//         sameSite: "none",    // can also be 'none' with secure true in prod
//     },
// };
//
// app.use(session(sessionOptions));
//
// // ——————————————
// // 3) ROUTES & STARTUP
// // ——————————————
// app.use(express.json());
//
// UserRoutes(app);
// CourseRoutes(app);
// ModuleRoutes(app);
// EnrollmentRoutes(app);
// AssignmentRoutes(app);
// Lab5(app);
// Hello(app);
//
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });
//
// // Debug route to inspect cookie/session
// app.post('/api/debug', (req, res) => {
//     console.log('🔐 Cookie:', req.headers.cookie);
//     console.log('🧠 Session:', req.session);
//     res.json({
//                  cookie: req.headers.cookie,
//                  session: req.session,
//                  currentUser: req.session.currentUser || null
//              });
// });